
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Cita } from '../../../models/cita.model';
import { Mascota } from '../../../models/mascota.model';
import { Propietario } from '../../../models/propietario.model';

import { CitaService } from '../../../core/services/cita.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { PropietarioService } from '../../../core/services/propietario.service';
import { AtencionService } from '../../../core/services/atencion.service';

@Component({
  selector: 'app-lista-citas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lista-citas.html',
  styleUrl: './lista-citas.css',
})
export class ListaCitas implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly citaService = inject(CitaService);
  private readonly mascotaService = inject(MascotaService);
  private readonly propietarioService = inject(PropietarioService);
  private readonly atencionService = inject(AtencionService);

  citas: Cita[] = [];
  mascotas: Mascota[] = [];
  propietarios: Propietario[] = [];

  mensajeExito = '';
  mensajeError = '';

  citaSeleccionada: Cita | null = null;

  formularioAtencion = this.fb.nonNullable.group({
    diagnostico: ['', [Validators.required, Validators.maxLength(500)]],
    tratamiento: ['', [Validators.required, Validators.maxLength(500)]],
    observaciones: [''],
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.citas = this.citaService.listar();
    this.mascotas = this.mascotaService.listar();
    this.propietarios = this.propietarioService.listar();
  }

  codigoCita(cita: Cita): string {
    return this.citaService.obtenerCodigo(cita);
  }

  obtenerMascota(mascotaId: string): string {
    const mascota = this.mascotas.find(item => item.id === mascotaId);
    return mascota?.nombre ?? 'Mascota no encontrada';
  }

  obtenerPropietario(mascotaId: string): string {
    const mascota = this.mascotas.find(item => item.id === mascotaId);

    if (!mascota) {
      return 'No encontrado';
    }

    const propietario = this.propietarios.find(
      item => item.id === mascota.propietarioId
    );

    return propietario
      ? `${propietario.nombres} ${propietario.apellidos}`
      : 'No encontrado';
  }

  obtenerCodigoPropietario(mascotaId: string): string {
    const mascota = this.mascotas.find(m => m.id === mascotaId);

    if (!mascota) {
      return 'No encontrado';
    }

    const propietario = this.propietarios.find(
      p => p.id === mascota.propietarioId
    );

    return propietario?.codigo ?? 'Sin código';
  }

  confirmarCita(cita: Cita): void {
    this.mensajeExito = '';
    this.mensajeError = '';

    try {
      this.citaService.cambiarEstado(cita.id, 'CONFIRMADA');
      this.cargarDatos();

      this.mensajeExito =
        `La cita ${this.codigoCita(cita)} fue confirmada correctamente.`;
    } catch (error) {
      this.mensajeError = error instanceof Error
        ? error.message
        : 'No se pudo confirmar la cita.';
    }
  }

  cancelarCita(cita: Cita): void {
    this.mensajeExito = '';
    this.mensajeError = '';

    const confirmar = window.confirm(
      `¿Está seguro de cancelar la cita ${this.codigoCita(cita)}?`
    );

    if (!confirmar) {
      return;
    }

    try {
      this.citaService.cambiarEstado(cita.id, 'CANCELADA');
      this.cargarDatos();

      this.mensajeExito =
        `La cita ${this.codigoCita(cita)} fue cancelada correctamente.`;
    } catch (error) {
      this.mensajeError = error instanceof Error
        ? error.message
        : 'No se pudo cancelar la cita.';
    }
  }

  abrirAtencion(cita: Cita): void {
    this.mensajeExito = '';
    this.mensajeError = '';

    if (cita.estado !== 'CONFIRMADA') {
      this.mensajeError = 'Primero debe confirmar la cita.';
      return;
    }

    this.citaSeleccionada = cita;
    this.formularioAtencion.reset();
  }

  cerrarAtencion(): void {
    this.citaSeleccionada = null;
    this.formularioAtencion.reset();
  }

  guardarAtencion(): void {
    if (!this.citaSeleccionada) {
      return;
    }

    if (this.formularioAtencion.invalid) {
      this.formularioAtencion.markAllAsTouched();
      return;
    }

    const cita = this.citaSeleccionada;
    const datos = this.formularioAtencion.getRawValue();

    try {
      this.atencionService.registrar({
        mascotaId: cita.mascotaId,
        citaId: cita.id,
        fecha: cita.fecha,
        motivo: cita.motivo,
        diagnostico: datos.diagnostico.trim(),
        tratamiento: datos.tratamiento.trim(),
        observaciones: datos.observaciones.trim(),
      });

      this.cerrarAtencion();
      this.cargarDatos();

      this.mensajeError = '';
      this.mensajeExito =
        `La atención de la cita ${this.codigoCita(cita)} se registró correctamente.`;

    } catch (error) {
      this.mensajeError = error instanceof Error
        ? error.message
        : 'No se pudo registrar la atención.';
    }
  }
}
