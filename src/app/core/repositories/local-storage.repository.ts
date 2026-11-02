
import { Repository } from './repository';

export class LocalStorageRepository<T extends { id: string }>
  implements Repository<T> {

  constructor(private readonly clave: string) {}

  // 1. Obtener todos los registros
  obtenerTodos(): T[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const datos = localStorage.getItem(this.clave);

    if (!datos) {
      return [];
    }

    try {
      const registros: unknown = JSON.parse(datos);

      return Array.isArray(registros)
        ? (registros as T[])
        : [];
    } catch {
      return [];
    }
  }

  // 2. Obtener un registro por su ID
  obtenerPorId(id: string): T | undefined {
    return this.obtenerTodos().find(
      registro => registro.id === id
    );
  }

  // 3. Guardar un nuevo registro
  guardar(entidad: T): void {
    if (typeof localStorage === 'undefined') {
      throw new Error('El almacenamiento local no está disponible.');
    }

    const registros = this.obtenerTodos();

    const existe = registros.some(
      registro => registro.id === entidad.id
    );

    if (existe) {
      throw new Error(
        'Ya existe un registro con ese identificador.'
      );
    }

    registros.push(entidad);

    localStorage.setItem(
      this.clave,
      JSON.stringify(registros)
    );
  }

  // 4. Actualizar un registro existente
  actualizar(entidad: T): void {
    if (typeof localStorage === 'undefined') {
      throw new Error('El almacenamiento local no está disponible.');
    }

    const registros = this.obtenerTodos();

    const indice = registros.findIndex(
      registro => registro.id === entidad.id
    );

    if (indice === -1) {
      throw new Error(
        'No se encontró el registro que desea actualizar.'
      );
    }

    registros[indice] = entidad;

    localStorage.setItem(
      this.clave,
      JSON.stringify(registros)
    );
  }

  // 5. Eliminar un registro por su ID
  eliminar(id: string): void {
    if (typeof localStorage === 'undefined') {
      throw new Error('El almacenamiento local no está disponible.');
    }

    const registros = this.obtenerTodos();

    const existe = registros.some(
      registro => registro.id === id
    );

    if (!existe) {
      throw new Error(
        'No se encontró el registro que desea eliminar.'
      );
    }

    const registrosActualizados = registros.filter(
      registro => registro.id !== id
    );

    localStorage.setItem(
      this.clave,
      JSON.stringify(registrosActualizados)
    );
  }
}
