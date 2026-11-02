import { Injectable, inject } from '@angular/core';

import { Atencion } from '../../models/atencion.model';
import { MascotaService } from './mascota.service';
import { CitaService } from './cita.service';
import { LocalStorageRepository } from '../repositories/local-storage.repository';

@Injectable({
  providedIn: 'root',
})
export class AtencionService {
  private readonly repositorio = new LocalStorageRepository<Atencion>('vetcare_atenciones');

  private readonly mascotaService = inject(MascotaService);
  private readonly citaService = inject(CitaService);

  listar(): Atencion[] {
    return this.repositorio.obtenerTodos();
  }

  listarPorMascota(mascotaId: string): Atencion[] {
    return this.listar().filter((atencion) => atencion.mascotaId === mascotaId);
  }

  registrar(datos: Omit<Atencion, 'id' | 'fechaRegistro'>): Atencion {
    // 1. Verificar que exista la mascota
    const mascotaExiste = this.mascotaService
      .listar()
      .some((mascota) => mascota.id === datos.mascotaId);

    if (!mascotaExiste) {
      throw new Error('La mascota no está registrada.');
    }

    // 2. Verificar la cita asociada
    if (!datos.citaId) {
      throw new Error('Debe seleccionar una cita.');
    }

    const cita = this.citaService.listar().find((item) => item.id === datos.citaId);

    if (!cita) {
      throw new Error('No se encontró la cita.');
    }

    // 3. Verificar que la cita corresponda a la mascota
    if (cita.mascotaId !== datos.mascotaId) {
      throw new Error('La cita no corresponde a esta mascota.');
    }

    // 4. Verificar el estado de la cita
    if (cita.estado !== 'CONFIRMADA') {
      throw new Error('Solo se pueden registrar atenciones de citas confirmadas.');
    }

    // 5. Evitar atenciones duplicadas
    const atencionExistente = this.listar().some((atencion) => atencion.citaId === datos.citaId);

    if (atencionExistente) {
      throw new Error('Esta cita ya tiene una atención registrada.');
    }

    // 6. Validar los datos clínicos
    if (!datos.diagnostico.trim()) {
      throw new Error('Debe ingresar un diagnóstico.');
    }

    if (!datos.tratamiento.trim()) {
      throw new Error('Debe ingresar un tratamiento.');
    }

    // 7. Crear la atención
    const atencion: Atencion = {
      ...datos,
      id: crypto.randomUUID(),
      fechaRegistro: new Date().toISOString(),
    };

    // 8. Guardar la atención veterinaria
    this.repositorio.guardar(atencion);

    // 9. Cambiar automáticamente el estado de la cita
    try {
      this.citaService.marcarComoAtendida(datos.citaId!);
    } catch (error) {
      this.repositorio.eliminar(atencion.id);
      throw error;
    }

    return atencion;
  }

  // Eliminar las atenciones asociadas a una mascota
  eliminarPorMascota(mascotaId: string): void {
    const atenciones = this.listarPorMascota(mascotaId);

    for (const atencion of atenciones) {
      this.repositorio.eliminar(atencion.id);
    }
  }
}
