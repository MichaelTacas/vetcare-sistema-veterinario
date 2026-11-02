
import { NegocioException } from './negocio.exception';

export class DuplicadoException extends NegocioException {
  constructor(message: string) {
    super(message, 'DUPLICADO');
    this.name = 'DuplicadoException';
  }
}
