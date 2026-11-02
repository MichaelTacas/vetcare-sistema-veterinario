
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dniValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dni = String(control.value ?? '').trim();

    if (!dni) {
      return null; // Validators.required comprueba si está vacío
    }

    return /^\d{8}$/.test(dni)
      ? null
      : { dniInvalido: true };
  };
}
