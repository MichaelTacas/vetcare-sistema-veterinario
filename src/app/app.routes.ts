
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then(m => m.Dashboard)
  },
  {
    path: 'registro/propietario',
    loadComponent: () =>
      import('./features/registro/registrar-propietario/registrar-propietario')
        .then(m => m.RegistrarPropietario)
  },
  {
    path: 'registro/mascota',
    loadComponent: () =>
      import('./features/registro/registrar-mascota/registrar-mascota')
        .then(m => m.RegistrarMascota)
  },
  {
    path: 'registros',
    loadComponent: () =>
      import('./features/consultas/consultar-registros/consultar-registros')
        .then(m => m.ConsultarRegistros)
  },
  {
    path: 'mascotas',
    redirectTo: 'registros'
  },
  {
    path: 'citas',
    loadComponent: () =>
      import('./features/citas/agendar-cita/agendar-cita')
        .then(m => m.AgendarCita)
  },
  {
    path: 'citas/lista',
    loadComponent: () =>
      import('./features/citas/lista_citas/lista-citas')
        .then(m => m.ListaCitas)
  },
  {
    path: 'historial',
    loadComponent: () =>
      import('./features/historial/historial-mascota/historial-mascota')
        .then(m => m.HistorialMascota)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
