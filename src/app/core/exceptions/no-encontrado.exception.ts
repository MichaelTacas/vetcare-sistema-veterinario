
import { NegocioException } from './negocio.exception';

export class NoEncontradoException extends NegocioException {
  constructor(message: string) {
    super(message, 'NO_ENCONTRADO');
    this.name = 'NoEncontradoException';
  }
}
