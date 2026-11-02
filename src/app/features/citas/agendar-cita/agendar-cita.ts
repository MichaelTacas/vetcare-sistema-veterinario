import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Mascota } from '../../../models/mascota.model';
import { MascotaService } from '../../../core/services/mascota.service';
import { CitaService } from '../../../core/services/cita.service';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './agendar-cita.html',
  styleUrl: './agendar-cita.css',
})
export class AgendarCita implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly mascotaService = inject(MascotaService);
  private readonly citaService = inject(CitaService);

  mascotas: Mascota[] = [];

  mensaje = '';
  error = '';

  // Horarios de atención veterinaria
  readonly horarios: string[] = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
  ];

  formulario = this.fb.nonNullable.group({
    mascotaId: ['', Validators.required],
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    motivo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300)]],
  });

  ngOnInit(): void {
    this.mascotas = this.mascotaService.listar();
  }

  // Verificar si el horario está ocupado
  horarioOcupado(hora: string): boolean {
    const fecha = this.formulario.controls.fecha.value;

    if (!fecha) {
      return false;
    }

    return this.citaService
      .listar()
      .some((cita) => cita.fecha === fecha && cita.hora === hora && cita.estado !== 'CANCELADA');
  }

  // Verificar si el horario ya pasó
  horarioPasado(hora: string): boolean {
    const fecha = this.formulario.controls.fecha.value;

    if (!fecha) {
      return false;
    }

    const fechaHora = new Date(`${fecha}T${hora}`);

    return Number.isNaN(fechaHora.getTime()) || fechaHora <= new Date();
  }

  // Seleccionar un horario disponible
  seleccionarHorario(hora: string): void {
    if (
      !this.formulario.controls.fecha.value ||
      this.horarioOcupado(hora) ||
      this.horarioPasado(hora)
    ) {
      return;
    }

    this.formulario.controls.hora.setValue(hora);
    this.formulario.controls.hora.markAsTouched();
  }

  // Limpiar la hora al cambiar de fecha
  cambiarFecha(): void {
    this.formulario.controls.hora.setValue('');
    this.mensaje = '';
    this.error = '';
  }

  // Registrar cita
  guardar(): void {
    this.mensaje = '';
    this.error = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.error = 'Complete correctamente los campos.';
      return;
    }

    try {
      this.citaService.registrar(this.formulario.getRawValue());

      this.mensaje = 'Cita registrada correctamente.';
      this.formulario.reset();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'No se pudo registrar la cita.';
    }
  }

  get fechaMinima(): string {
    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }
}
