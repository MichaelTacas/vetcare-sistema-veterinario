
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MascotaService } from '../../../core/services/mascota.service';
import { PropietarioService } from '../../../core/services/propietario.service';
import { fechaNacimientoValidator } from '../../../core/validators/fecha-nacimiento.validator';

@Component({
  selector: 'app-registrar-mascota',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registrar-mascota.html',
  styleUrl: './registrar-mascota.css'
})
export class RegistrarMascota {
  private readonly fb = inject(FormBuilder);
  private readonly mascotaService = inject(MascotaService);
  private readonly propietarioService = inject(PropietarioService);

  propietarios = this.propietarioService.listar();

  mensaje = '';
  error = '';

  formulario = this.fb.group({
    nombre: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)
    ]),
    especie: this.fb.nonNullable.control<'PERRO' | 'GATO' | 'OTRO'>(
      'PERRO'
    ),
    otraEspecie: this.fb.nonNullable.control(''),
    raza: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(60)
    ]),
    sexo: this.fb.nonNullable.control<'MACHO' | 'HEMBRA'>(
      'MACHO'
    ),
    fechaNacimiento: this.fb.nonNullable.control('', [
      Validators.required,
      fechaNacimientoValidator()
    ]),
    peso: this.fb.control<number | null>(null, [
      Validators.min(0.01)
    ]),
    propietarioId: this.fb.nonNullable.control(
      '',
      Validators.required
    ),
    observaciones: this.fb.nonNullable.control('', [
      Validators.maxLength(500)
    ])
  });

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.error = 'Corrija los campos señalados.';
      return;
    }

    const datos = this.formulario.getRawValue();

    if (
      datos.especie === 'OTRO' &&
      datos.otraEspecie.trim().length < 2
    ) {
      this.error = 'Especifique el tipo de animal.';
      return;
    }

    try {
      this.mascotaService.registrar(datos);
      this.formulario.reset();
      this.mensaje = 'Mascota registrada correctamente.';
    } catch (error) {
      this.error = error instanceof Error
        ? error.message
        : 'No se pudo registrar la mascota.';
    }
  }
}
