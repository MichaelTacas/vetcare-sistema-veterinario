export interface Repository<T extends { id: string }> {
  obtenerTodos(): T[];
  obtenerPorId(id: string): T | undefined;
  guardar(entidad: T): void;
  actualizar(entidad: T): void;
  eliminar(id: string): void;
}