
import { Injectable } from '@angular/core';

import { Propietario } from '../../models/propietario.model';
import { Mascota } from '../../models/mascota.model';
import { Cita } from '../../models/cita.model';
import { Atencion } from '../../models/atencion.model';

import { LocalStorageRepository } from '../repositories/local-storage.repository';
import { NoEncontradoException } from '../exceptions/no-encontrado.exception';
import { ValidacionException } from '../exceptions/validacion.exception';

@Injectable({
  providedIn: 'root',
})
export class EliminacionCascadaService {

  private readonly propietarios =
    new LocalStorageRepository<Propietario>('vetcare_propietarios');

  private readonly mascotas =
    new LocalStorageRepository<Mascota>('vetcare_mascotas');

  private readonly citas =
    new LocalStorageRepository<Cita>('vetcare_citas');

  private readonly atenciones =
    new LocalStorageRepository<Atencion>('vetcare_atenciones');

  eliminarPropietario(propietarioId: string): void {

    // 1. Validar el identificador
    if (!propietarioId || !propietarioId.trim()) {
      throw new ValidacionException(
        'Debe indicar el propietario que desea eliminar.'
      );
    }

    // 2. Verificar que exista el propietario
    const propietario = this.propietarios.obtenerPorId(propietarioId);

    if (!propietario) {
      throw new NoEncontradoException(
        'No se encontró el propietario.'
      );
    }

    // 3. Obtener sus mascotas
    const mascotasAsociadas = this.mascotas
      .obtenerTodos()
      .filter(mascota => mascota.propietarioId === propietarioId);

    // 4. Eliminar los registros relacionados
    for (const mascota of mascotasAsociadas) {

      // Eliminar las atenciones de la mascota
      const atencionesAsociadas = this.atenciones
        .obtenerTodos()
        .filter(atencion => atencion.mascotaId === mascota.id);

      for (const atencion of atencionesAsociadas) {
        this.atenciones.eliminar(atencion.id);
      }

      // Eliminar las citas de la mascota
      const citasAsociadas = this.citas
        .obtenerTodos()
        .filter(cita => cita.mascotaId === mascota.id);

      for (const cita of citasAsociadas) {
        this.citas.eliminar(cita.id);
      }

      // Eliminar la mascota
      this.mascotas.eliminar(mascota.id);
    }

    // 5. Eliminar al propietario
    this.propietarios.eliminar(propietarioId);
  }
}
