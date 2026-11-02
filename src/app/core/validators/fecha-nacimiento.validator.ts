
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fechaNacimientoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = String(control.value ?? '');

    if (!valor) {
      return null;
    }

    const fecha = new Date(`${valor}T00:00:00`);

    if (Number.isNaN(fecha.getTime())) {
      return { fechaInvalida: true };
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return fecha > hoy
      ? { fechaFutura: true }
      : null;
  };
}
