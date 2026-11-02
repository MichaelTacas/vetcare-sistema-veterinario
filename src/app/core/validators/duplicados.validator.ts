
export function existeDuplicado<T>(
  registros: readonly T[],
  valor: string,
  obtenerValor: (registro: T) => string
): boolean {
  const valorNormalizado = valor.trim().toLowerCase();

  return registros.some(
    registro =>
      obtenerValor(registro).trim().toLowerCase() === valorNormalizado
  );
}
