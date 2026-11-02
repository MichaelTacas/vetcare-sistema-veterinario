
export type EstadoCita =
  | 'PENDIENTE'
  | 'CONFIRMADA'
  | 'ATENDIDA'
  | 'CANCELADA';

export interface Cita {
  id: string;
  mascotaId: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: EstadoCita;
  fechaRegistro: string;
}
