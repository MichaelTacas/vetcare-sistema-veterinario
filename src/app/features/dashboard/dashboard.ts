
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PropietarioService } from '../../core/services/propietario.service';
import { MascotaService } from '../../core/services/mascota.service';
import { CitaService } from '../../core/services/cita.service';

import { Propietario } from '../../models/propietario.model';
import { Mascota } from '../../models/mascota.model';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private readonly router = inject(Router);

  private readonly propietarioService = inject(PropietarioService);
  private readonly mascotaService = inject(MascotaService);
  private readonly citaService = inject(CitaService);

  propietarios: Propietario[] = [];
  mascotas: Mascota[] = [];
  citas: Cita[] = [];

  totalPropietarios = 0;
  totalMascotas = 0;
  totalCitas = 0;
  totalAtenciones = 0;

  ngOnInit(): void {
    this.actualizarContadores();
  }

  actualizarContadores(): void {
    this.propietarios = this.propietarioService.listar();
    this.mascotas = this.mascotaService.listar();
    this.citas = this.citaService.listar();

    this.totalPropietarios = this.propietarios.length;
    this.totalMascotas = this.mascotas.length;

    this.totalCitas = this.citas.filter(
      cita =>
        cita.estado === 'PENDIENTE' ||
        cita.estado === 'CONFIRMADA'
    ).length;

    // Se conectará al servicio de atenciones posteriormente.
    this.totalAtenciones = 0;
  }

  irAPropietarios(): void {
    this.router.navigate(['/registros'], {
      queryParams: { tipo: 'propietarios' }
    });
  }

  irAMascotas(): void {
    this.router.navigate(['/registros'], {
      queryParams: { tipo: 'mascotas' }
    });
  }

  irACitas(): void {
    this.router.navigate(['/citas']);
  }

  irAHistorial(): void {
    this.router.navigate(['/historial']);
  }

  registrarPropietario(): void {
    this.router.navigate(['/registro/propietario']);
  }

  registrarMascota(): void {
    this.router.navigate(['/registro/mascota']);
  }

  agendarCita(): void {
    this.router.navigate(['/citas']);
  }

  consultarRegistros(): void {
    this.router.navigate(['/registros']);
  }

  nombreMascota(mascotaId: string): string {
    return this.mascotas.find(
      mascota => mascota.id === mascotaId
    )?.nombre ?? 'Mascota no encontrada';
  }

  get proximasCitas(): Cita[] {
    const ahora = new Date();

    return this.citas
      .filter(cita =>
        (cita.estado === 'PENDIENTE' ||
         cita.estado === 'CONFIRMADA') &&
        new Date(`${cita.fecha}T${cita.hora}`) >= ahora
      )
      .sort((a, b) =>
        `${a.fecha}T${a.hora}`.localeCompare(
          `${b.fecha}T${b.hora}`
        )
      )
      .slice(0, 5);
  }

  get ultimasMascotas(): Mascota[] {
    return [...this.mascotas]
      .sort((a, b) =>
        b.fechaRegistro.localeCompare(a.fechaRegistro)
      )
      .slice(0, 5);
  }
}
