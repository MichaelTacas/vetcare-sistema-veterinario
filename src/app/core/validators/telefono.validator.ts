
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function telefonoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const telefono = String(control.value ?? '').trim();

    if (!telefono) {
      return null;
    }

    return /^9\d{8}$/.test(telefono)
      ? null
      : { telefonoInvalido: true };
  };
}
