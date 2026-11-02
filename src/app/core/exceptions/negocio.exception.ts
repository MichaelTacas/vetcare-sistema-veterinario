
export class NegocioException extends Error {
  constructor(
    message: string,
    public readonly codigo: string
  ) {
    super(message);
    this.name = 'NegocioException';
  }
}
