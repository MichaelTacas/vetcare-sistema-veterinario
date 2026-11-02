import { Injectable, InjectionToken, inject } from '@angular/core';

import { Propietario } from '../../models/propietario.model';
import { Mascota } from '../../models/mascota.model';

import { Repository } from '../repositories/repository';
import { LocalStorageRepository } from '../repositories/local-storage.repository';
import { existeDuplicado } from '../validators/duplicados.validator';

import { ValidacionException } from '../exceptions/validacion.exception';
import { DuplicadoException } from '../exceptions/duplicado.exception';
import { NoEncontradoException } from '../exceptions/no-encontrado.exception';

export const PROPIETARIO_REPOSITORY = new InjectionToken<Repository<Propietario>>(
  'PROPIETARIO_REPOSITORY',
  {
    providedIn: 'root',
    factory: () => new LocalStorageRepository<Propietario>('vetcare_propietarios'),
  },
);

@Injectable({
  providedIn: 'root',
})
export class PropietarioService {
  private readonly repositorio = inject(PROPIETARIO_REPOSITORY);

  private readonly mascotaRepositorio: Repository<Mascota> = new LocalStorageRepository<Mascota>(
    'vetcare_mascotas',
  );

  // 1. Listar propietarios
  listar(): Propietario[] {
    return this.repositorio.obtenerTodos();
  }

  // 2. Generar un código único y consecutivo
  private generarCodigo(): string {
    const propietarios = this.listar();

    const numeros = propietarios
      .map((propietario) => propietario.codigo)
      .filter((codigo): codigo is string => typeof codigo === 'string' && /^PROP-\d+$/.test(codigo))
      .map((codigo) => Number(codigo.substring(5)));

    // Conservar el contador aunque se eliminen propietarios.
    const claveContador = 'vetcare_ultimo_codigo_propietario';
    const contadorGuardado = Number(localStorage.getItem(claveContador) ?? '0');

    const ultimoNumero = Math.max(
      0,
      Number.isFinite(contadorGuardado) ? contadorGuardado : 0,
      ...numeros,
    );

    const siguienteNumero = ultimoNumero + 1;

    localStorage.setItem(claveContador, String(siguienteNumero));

    return `PROP-${String(siguienteNumero).padStart(3, '0')}`;
  }

  // 3. Registrar propietario
  registrar(datos: Omit<Propietario, 'id' | 'codigo' | 'fechaRegistro'>): Propietario {
    const nombres = datos.nombres.trim();
    const apellidos = datos.apellidos.trim();
    const dni = datos.dni.trim();
    const telefono = datos.telefono.trim();
    const correo = datos.correo.trim();
    const direccion = datos.direccion.trim();

    // Validar nombres y apellidos
    const patronNombre = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;

    if (
      nombres.length < 2 ||
      apellidos.length < 2 ||
      !patronNombre.test(nombres) ||
      !patronNombre.test(apellidos)
    ) {
      throw new ValidacionException('Ingrese nombres y apellidos válidos.');
    }

    // Validar DNI
    if (!/^\d{8}$/.test(dni)) {
      throw new ValidacionException('El DNI debe tener exactamente 8 dígitos.');
    }

    // Validar teléfono
    if (!/^9\d{8}$/.test(telefono)) {
      throw new ValidacionException('El celular debe tener 9 dígitos y comenzar con 9.');
    }

    // Validar correo electrónico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      throw new ValidacionException('Ingrese un correo electrónico válido.');
    }

    // Validar dirección
    if (direccion.length < 5 || direccion.length > 150) {
      throw new ValidacionException('La dirección debe tener entre 5 y 150 caracteres.');
    }

    // Evitar DNI duplicados
    if (existeDuplicado(this.listar(), dni, (propietario) => propietario.dni)) {
      throw new DuplicadoException('Ya existe un propietario registrado con ese DNI.');
    }

    // Crear propietario con código automático
    const propietario: Propietario = {
      id: crypto.randomUUID(),
      codigo: this.generarCodigo(),
      nombres,
      apellidos,
      dni,
      telefono,
      correo,
      direccion,
      fechaRegistro: new Date().toISOString(),
    };

    // Guardar propietario
    this.repositorio.guardar(propietario);

    return propietario;
  }

  // DELETE: eliminar propietario y sus mascotas
  eliminar(id: string): void {
    // 1. Validar el identificador
    if (!id || !id.trim()) {
      throw new ValidacionException('Debe indicar el propietario que desea eliminar.');
    }

    // 2. Verificar que exista el propietario
    const propietario = this.repositorio.obtenerPorId(id);

    if (!propietario) {
      throw new NoEncontradoException('No se encontró el propietario que desea eliminar.');
    }

    // 3. Buscar todas las mascotas del propietario
    const mascotas = this.mascotaRepositorio
      .obtenerTodos()
      .filter((mascota) => mascota.propietarioId === id);

    // 4. Eliminar las mascotas asociadas
    for (const mascota of mascotas) {
      this.mascotaRepositorio.eliminar(mascota.id);
    }

    // 5. Eliminar al propietario
    this.repositorio.eliminar(id);
  }
}
