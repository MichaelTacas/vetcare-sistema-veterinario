
import { Injectable, InjectionToken, inject } from '@angular/core';

import { Mascota } from '../../models/mascota.model';
import { Repository } from '../repositories/repository';
import { LocalStorageRepository } from '../repositories/local-storage.repository';
import { PropietarioService } from './propietario.service';

export const MASCOTA_REPOSITORY =
  new InjectionToken<Repository<Mascota>>('MASCOTA_REPOSITORY', {
    providedIn: 'root',
    factory: () =>
      new LocalStorageRepository<Mascota>('vetcare_mascotas')
  });

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private readonly repositorio = inject(MASCOTA_REPOSITORY);
  private readonly propietarioService = inject(PropietarioService);

  listar(): Mascota[] {
    return this.repositorio.obtenerTodos();
  }

  registrar(
    datos: Omit<Mascota, 'id' | 'fechaRegistro'>
  ): Mascota {

    const nombre = datos.nombre.trim();
    const raza = datos.raza.trim();
    const observaciones = datos.observaciones.trim();

    if (nombre.length < 2 || nombre.length > 50) {
      throw new Error('El nombre debe tener entre 2 y 50 caracteres.');
    }

    if (!['PERRO', 'GATO', 'OTRO'].includes(datos.especie)) {
      throw new Error('Seleccione una especie válida.');
    }

    if (!['MACHO', 'HEMBRA'].includes(datos.sexo)) {
      throw new Error('Seleccione el sexo de la mascota.');
    }

    if (raza.length < 2 || raza.length > 60) {
      throw new Error('Ingrese una raza válida.');
    }

    const fecha = new Date(`${datos.fechaNacimiento}T00:00:00`);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (
      !datos.fechaNacimiento ||
      Number.isNaN(fecha.getTime()) ||
      fecha > hoy
    ) {
      throw new Error('La fecha de nacimiento no es válida.');
    }

    if (
      datos.peso !== null &&
      (!Number.isFinite(datos.peso) || datos.peso <= 0)
    ) {
      throw new Error('El peso debe ser mayor que cero.');
    }

    if (observaciones.length > 500) {
      throw new Error('Las observaciones no deben superar 500 caracteres.');
    }

    const propietarioExiste = this.propietarioService
      .listar()
      .some(propietario => propietario.id === datos.propietarioId);

    if (!propietarioExiste) {
      throw new Error('Debe seleccionar un propietario registrado.');
    }

    const mascota: Mascota = {
      ...datos,
      id: crypto.randomUUID(),
      nombre,
      raza,
      observaciones,
      fechaRegistro: new Date().toISOString()
    };

    this.repositorio.guardar(mascota);

    return mascota;
  }
}
