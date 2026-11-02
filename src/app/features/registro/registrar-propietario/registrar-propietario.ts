
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { PropietarioService } from '../../../core/services/propietario.service';
import { dniValidator } from '../../../core/validators/dni.validator';
import { telefonoValidator } from '../../../core/validators/telefono.validator';

@Component({
  selector: 'app-registrar-propietario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registrar-propietario.html',
  styleUrl: './registrar-propietario.css'
})
export class RegistrarPropietario {
  private readonly fb = inject(FormBuilder);
  private readonly propietarioService = inject(PropietarioService);

  mensaje = '';
  error = '';

  formulario = this.fb.nonNullable.group({
    nombres: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    dni: ['', [Validators.required, dniValidator()]],
    telefono: ['', [Validators.required, telefonoValidator()]],
    correo: ['', [Validators.required, Validators.email]],
    direccion: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(150)
    ]]
  });

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.error = 'Corrija los campos señalados.';
      return;
    }

    try {
      this.propietarioService.registrar(this.formulario.getRawValue());
      this.formulario.reset();
      this.mensaje = 'Propietario registrado correctamente.';
    } catch (error) {
      this.error = error instanceof Error
        ? error.message
        : 'No se pudo registrar al propietario.';
    }
  }
}
