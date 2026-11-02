import { Injectable, InjectionToken, inject } from '@angular/core';

import { Cita, EstadoCita } from '../../models/cita.model';
import { MascotaService } from './mascota.service';
import { Repository } from '../repositories/repository';
import { LocalStorageRepository } from '../repositories/local-storage.repository';
import { horarioOcupado } from '../validators/disponibilidad.validator';
import { DuplicadoException } from '../exceptions/duplicado.exception';

export const CITA_REPOSITORY = new InjectionToken<Repository<Cita>>('CITA_REPOSITORY', {
  providedIn: 'root',
  factory: () => new LocalStorageRepository<Cita>('vetcare_citas'),
});

@Injectable({
  providedIn: 'root',
})
export class CitaService {
  private readonly repositorio = inject(CITA_REPOSITORY);
  private readonly mascotaService = inject(MascotaService);

  // Obtener todas las citas
  listar(): Cita[] {
    return this.repositorio.obtenerTodos();
  }

  // Generar código visible de la cita
  obtenerCodigo(cita: Cita): string {
    return `CIT-${cita.id.slice(0, 8).toUpperCase()}`;
  }

  // Registrar una cita
  registrar(datos: Pick<Cita, 'mascotaId' | 'fecha' | 'hora' | 'motivo'>): Cita {
    const mascotaExiste = this.mascotaService.listar().some((m) => m.id === datos.mascotaId);

    if (!mascotaExiste) {
      throw new Error('Seleccione una mascota registrada.');
    }

    if (!datos.fecha || !datos.hora) {
      throw new Error('Seleccione una fecha y hora.');
    }

    const fechaHora = new Date(`${datos.fecha}T${datos.hora}`);

    if (Number.isNaN(fechaHora.getTime()) || fechaHora <= new Date()) {
      throw new Error('La cita debe tener una fecha y hora futura.');
    }

    const motivo = datos.motivo.trim();

    if (motivo.length < 5 || motivo.length > 300) {
      throw new Error('El motivo debe tener entre 5 y 300 caracteres.');
    }

    if (horarioOcupado(this.listar(), datos.fecha, datos.hora)) {
      throw new DuplicadoException('El horario seleccionado ya está ocupado.');
    }

    const cita: Cita = {
      id: crypto.randomUUID(),
      mascotaId: datos.mascotaId,
      fecha: datos.fecha,
      hora: datos.hora,
      motivo,
      estado: 'PENDIENTE',
      fechaRegistro: new Date().toISOString(),
    };

    this.repositorio.guardar(cita);

    return cita;
  }

  // Cambiar el estado de una cita existente
  cambiarEstado(id: string, estado: EstadoCita): void {
    const cita = this.repositorio.obtenerPorId(id);

    if (!cita) {
      throw new Error('No se encontró la cita.');
    }

    if (cita.estado === 'CANCELADA' || cita.estado === 'ATENDIDA') {
      throw new Error('Esta cita ya está finalizada.');
    }

    if (estado === 'ATENDIDA' || estado === 'PENDIENTE') {
      throw new Error('Esta transición no está permitida desde esta operación.');
    }

    this.repositorio.actualizar({
      ...cita,
      estado,
    });
  }

  // Finalizar una cita después de registrar la atención veterinaria
  marcarComoAtendida(id: string): void {
    const cita = this.repositorio.obtenerPorId(id);

    if (!cita) {
      throw new Error('No se encontró la cita.');
    }

    if (cita.estado !== 'CONFIRMADA') {
      throw new Error('Solo se pueden atender citas que estén confirmadas.');
    }

    this.repositorio.actualizar({
      ...cita,
      estado: 'ATENDIDA',
    });
  }

  // Eliminar todas las citas asociadas a una mascota
  eliminarPorMascota(mascotaId: string): void {
    const citas = this.listar().filter((cita) => cita.mascotaId === mascotaId);

    for (const cita of citas) {
      this.repositorio.eliminar(cita.id);
    }
  }
}
