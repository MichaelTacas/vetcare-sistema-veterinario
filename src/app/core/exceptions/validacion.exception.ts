
import { NegocioException } from './negocio.exception';

export class ValidacionException extends NegocioException {
  constructor(message: string) {
    super(message, 'VALIDACION');
    this.name = 'ValidacionException';
  }
}
