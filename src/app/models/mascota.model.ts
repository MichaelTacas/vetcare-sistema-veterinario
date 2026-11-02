
export type EspecieMascota = 'PERRO' | 'GATO' | 'OTRO';
export type SexoMascota = 'MACHO' | 'HEMBRA';

export interface Mascota {
  id: string;
  nombre: string;
  especie: EspecieMascota;
  raza: string;
  sexo: SexoMascota;
  fechaNacimiento: string;
  peso: number | null;
  propietarioId: string;
  observaciones: string;
  fechaRegistro: string;
  otraEspecie?: string;
}
