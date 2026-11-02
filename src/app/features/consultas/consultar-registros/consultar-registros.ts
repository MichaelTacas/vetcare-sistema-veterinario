
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EliminacionCascadaService } from '../../../core/services/eliminacion-cascada.service';

import { Propietario } from '../../../models/propietario.model';
import { Mascota } from '../../../models/mascota.model';

import { PropietarioService } from '../../../core/services/propietario.service';
import { MascotaService } from '../../../core/services/mascota.service';

@Component({
  selector: 'app-consultar-registros',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './consultar-registros.html',
  styleUrl: './consultar-registros.css'
})
export class ConsultarRegistros {

  private readonly propietarioService = inject(PropietarioService);
  private readonly mascotaService = inject(MascotaService);
  private readonly route = inject(ActivatedRoute);
  private readonly eliminacionCascadaService =
  inject(EliminacionCascadaService);

  propietarioSeleccionado: Propietario | null = null;
  mascotaSeleccionada: Mascota | null = null;

  propietarioParaEliminar: Propietario | null = null;

  mensajeExito = '';
  mensajeError = '';

  pestana: 'propietarios' | 'mascotas' = 'propietarios';
  busqueda = '';

  propietarios: Propietario[] = [];
  mascotas: Mascota[] = [];

  constructor() {
    this.actualizarRegistros();

    const tipo = this.route.snapshot.queryParamMap.get('tipo');

    if (tipo === 'mascotas') {
      this.pestana = 'mascotas';
    }
  }

  // Contar las mascotas de un propietario
  cantidadMascotas(propietarioId: string): number {
    return this.mascotasDelPropietario(propietarioId).length;
  }

  // Actualizar propietarios y mascotas
  actualizarRegistros(): void {
    this.propietarios = this.propietarioService.listar();
    this.mascotas = this.mascotaService.listar();
  }

  // Cambiar entre las pestañas
  cambiarPestana(pestana: 'propietarios' | 'mascotas'): void {
    this.pestana = pestana;
    this.busqueda = '';
    this.cerrarDetalles();
    this.limpiarMensajes();
    this.actualizarRegistros();
  }

  // Buscar propietarios por código, nombre, DNI o correo
  get propietariosFiltrados(): Propietario[] {
    const texto = this.busqueda.trim().toLowerCase();

    return this.propietarios.filter(p =>
      `${p.codigo ?? ''} ${p.nombres} ${p.apellidos} ${p.dni} ${p.correo}`
        .toLowerCase()
        .includes(texto)
    );
  }

  // Buscar mascotas
  get mascotasFiltradas(): Mascota[] {
    const texto = this.busqueda.trim().toLowerCase();

    return this.mascotas.filter(m =>
      `${m.nombre} ${m.especie} ${m.otraEspecie ?? ''} ${m.raza} ${this.nombrePropietario(m.propietarioId)} ${this.codigoPropietario(m.propietarioId)}`
        .toLowerCase()
        .includes(texto)
    );
  }

  // Obtener el nombre del propietario
  nombrePropietario(id: string): string {
    const propietario = this.propietarios.find(p => p.id === id);

    return propietario
      ? `${propietario.nombres} ${propietario.apellidos}`
      : 'No encontrado';
  }

  // NUEVO: Obtener el código del propietario
  codigoPropietario(id: string): string {
    const propietario = this.propietarios.find(p => p.id === id);

    return propietario?.codigo ?? 'Sin código';
  }

  // Mostrar la especie de la mascota
  especieVisible(mascota: Mascota): string {
    return mascota.especie === 'OTRO'
      ? mascota.otraEspecie || 'Otro'
      : mascota.especie === 'PERRO'
        ? 'Perro'
        : 'Gato';
  }

  // Ver los detalles del propietario
  verPropietario(propietario: Propietario): void {
    this.propietarioSeleccionado = propietario;
    this.mascotaSeleccionada = null;
  }

  // Ver los detalles de la mascota
  verMascota(mascota: Mascota): void {
    this.mascotaSeleccionada = mascota;
    this.propietarioSeleccionado = null;
  }

  // Cerrar los detalles
  cerrarDetalles(): void {
    this.propietarioSeleccionado = null;
    this.mascotaSeleccionada = null;
  }

  // Obtener las mascotas asociadas al propietario
  mascotasDelPropietario(propietarioId: string): Mascota[] {
    return this.mascotas.filter(
      mascota => mascota.propietarioId === propietarioId
    );
  }

  // Abrir confirmación de eliminación
  confirmarEliminarPropietario(propietario: Propietario): void {
    this.limpiarMensajes();
    this.cerrarDetalles();
    this.propietarioParaEliminar = propietario;
  }

  // Cancelar eliminación
  cancelarEliminarPropietario(): void {
    this.propietarioParaEliminar = null;
  }

  // Eliminar propietario
  eliminarPropietario(): void {
    if (!this.propietarioParaEliminar) {
      return;
    }

    const propietario = this.propietarioParaEliminar;

    try {
      this.eliminacionCascadaService.eliminarPropietario(propietario.id);

      this.actualizarRegistros();

      this.mensajeExito =
        `El propietario ${propietario.nombres} ${propietario.apellidos} fue eliminado correctamente.`;

      this.mensajeError = '';
      this.propietarioParaEliminar = null;

    } catch (error: unknown) {
      this.mensajeError = error instanceof Error
        ? error.message
        : 'Ocurrió un error al eliminar el propietario.';

      this.mensajeExito = '';
      this.propietarioParaEliminar = null;
    }
  }

  // Limpiar mensajes
  limpiarMensajes(): void {
    this.mensajeExito = '';
    this.mensajeError = '';
  }
}
