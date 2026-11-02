import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Mascota } from '../../../models/mascota.model';
import { Atencion } from '../../../models/atencion.model';
import { Cita } from '../../../models/cita.model';
import { Propietario } from '../../../models/propietario.model';

import { MascotaService } from '../../../core/services/mascota.service';
import { AtencionService } from '../../../core/services/atencion.service';
import { CitaService } from '../../../core/services/cita.service';
import { PropietarioService } from '../../../core/services/propietario.service';

type FiltroEspecie = 'PERRO' | 'GATO' | 'OTRO';

@Component({
  selector: 'app-historial-mascota',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './historial-mascota.html',
  styleUrl: './historial-mascota.css',
})
export class HistorialMascota implements OnInit {
  private readonly mascotaService = inject(MascotaService);
  private readonly atencionService = inject(AtencionService);
  private readonly citaService = inject(CitaService);
  private readonly propietarioService = inject(PropietarioService);

  mascotas: Mascota[] = [];
  atenciones: Atencion[] = [];
  citas: Cita[] = [];
  propietarios: Propietario[] = [];

  especieSeleccionada: FiltroEspecie | '' = '';
  otraEspecie = '';
  busqueda = '';
  mascotaSeleccionadaId = '';

  ngOnInit(): void {
    this.cargarDatos();
  }

  cambiarFiltro(): void {
    this.mascotaSeleccionadaId = '';

    const mascotasEncontradas = this.mascotasFiltradas;

    // Si solo hay una mascota, seleccionarla automáticamente.
    if (mascotasEncontradas.length === 1) {
      this.mascotaSeleccionadaId = mascotasEncontradas[0].id;
    }
  }

  actualizarSeleccion(): void {
    const mascotasEncontradas = this.mascotasFiltradas;

    if (mascotasEncontradas.length === 1) {
      this.mascotaSeleccionadaId = mascotasEncontradas[0].id;
    } else {
      this.mascotaSeleccionadaId = '';
    }
  }

  cargarDatos(): void {
    this.mascotas = this.mascotaService.listar();
    this.atenciones = this.atencionService.listar();
    this.citas = this.citaService.listar();
    this.propietarios = this.propietarioService.listar();
  }

  cargarMascotas(): void {
    this.cargarDatos();
  }

  get mascotasFiltradas(): Mascota[] {
    const texto = this.busqueda.trim().toLowerCase();
    const especieOtra = this.otraEspecie.trim().toLowerCase();

    return this.mascotas.filter((mascota) => {
      const coincideEspecie =
        !this.especieSeleccionada || mascota.especie === this.especieSeleccionada;

      const coincideOtra =
        this.especieSeleccionada !== 'OTRO' ||
        !especieOtra ||
        (mascota.otraEspecie ?? '').toLowerCase().includes(especieOtra);

      const coincideNombre = mascota.nombre.toLowerCase().includes(texto);

      return coincideEspecie && coincideOtra && coincideNombre;
    });
  }

  get mascotaSeleccionada(): Mascota | undefined {
    return this.mascotas.find((mascota) => mascota.id === this.mascotaSeleccionadaId);
  }

  get atencionesMascota(): Atencion[] {
    if (!this.mascotaSeleccionadaId) {
      return [];
    }

    return this.atenciones
      .filter((atencion) => atencion.mascotaId === this.mascotaSeleccionadaId)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  nombreEspecie(mascota: Mascota): string {
    if (mascota.especie === 'OTRO') {
      return mascota.otraEspecie || 'Otro';
    }

    return mascota.especie === 'PERRO' ? 'Perro' : 'Gato';
  }

  obtenerPropietario(mascota: Mascota): string {
    const propietario = this.propietarios.find((item) => item.id === mascota.propietarioId);

    return propietario ? `${propietario.nombres} ${propietario.apellidos}` : 'No encontrado';
  }

  obtenerCodigoPropietario(mascota: Mascota): string {
    const propietario = this.propietarios.find((item) => item.id === mascota.propietarioId);

    return propietario?.codigo ?? 'Sin código';
  }

  obtenerCodigoCita(atencion: Atencion): string {
    if (!atencion.citaId) {
      return 'Sin cita asociada';
    }

    const cita = this.citas.find((item) => item.id === atencion.citaId);

    return cita ? this.citaService.obtenerCodigo(cita) : 'Cita no encontrada';
  }

  limpiarSeleccion(): void {
    this.mascotaSeleccionadaId = '';

    if (this.especieSeleccionada !== 'OTRO') {
      this.otraEspecie = '';
    }
  }
}
