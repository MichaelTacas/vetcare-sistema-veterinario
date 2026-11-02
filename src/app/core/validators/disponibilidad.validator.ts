
import { Cita } from '../../models/cita.model';

export function horarioOcupado(
  citas: readonly Cita[],
  fecha: string,
  hora: string
): boolean {
  return citas.some(cita =>
    cita.fecha === fecha &&
    cita.hora === hora &&
    cita.estado !== 'CANCELADA'
  );
}
