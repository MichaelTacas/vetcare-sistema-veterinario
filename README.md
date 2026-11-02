
# VetCare - Sistema de Gestión Veterinaria

## Descripción

VetCare es una aplicación web desarrollada con Angular y TypeScript para gestionar los procesos básicos de una clínica veterinaria.

Permite registrar propietarios, administrar mascotas, programar citas veterinarias, registrar atenciones y consultar el historial clínico.

## Curso

Desarrollo de Interfaces 3 - IDAT

## Integrantes

- Tacas Rocha, Jeymi Michael
- Hernandez Ramirez, Aldair Davis

## Tecnologías utilizadas

- Angular
- TypeScript
- HTML5
- CSS3
- Bootstrap
- Bootstrap Icons
- LocalStorage
- Git y GitHub

## Funcionalidades

### Gestión de propietarios
- Registrar propietarios.
- Validar datos personales.
- Consultar y buscar registros.
- Relacionar propietarios con mascotas.

### Gestión de mascotas
- Registrar perros, gatos y otras especies.
- Asociar mascotas a propietarios.
- Consultar información de mascotas.
- Filtrar registros.

### Gestión de citas
- Agendar citas veterinarias.
- Consultar horarios disponibles.
- Evitar reservas en horarios ocupados.
- Confirmar y cancelar citas.
- Visualizar los estados de las citas.

### Atenciones veterinarias
- Registrar diagnósticos.
- Registrar tratamientos.
- Agregar observaciones.
- Asociar la atención con una cita.
- Cambiar automáticamente la cita a ATENDIDA.

### Historial clínico
- Filtrar mascotas por especie.
- Seleccionar mascotas registradas.
- Consultar atenciones anteriores.
- Visualizar diagnósticos, tratamientos y observaciones.
- Consultar el código de la cita asociada.

### Dashboard
- Visualizar información general del sistema.
- Consultar indicadores y registros recientes.

## Arquitectura

El proyecto utiliza una estructura organizada por responsabilidades:

```text
src/app/
├── core/
│   ├── exceptions/
│   ├── repositories/
│   ├── services/
│   └── validators/
├── models/
├── features/
│   ├── dashboard/
│   ├── registro/
│   ├── consultas/
│   ├── citas/
│   └── historial/
├── shared/
│   └── components/
└── app.routes.ts
```

## Funcionamiento

Los componentes Angular presentan los formularios y capturan las acciones del usuario.

Los servicios contienen las operaciones y validaciones.

Los repositorios gestionan el almacenamiento local.

Los modelos definen la estructura de los datos.

Flujo general:

Vista HTML → Componente TypeScript → Servicio → Repositorio → LocalStorage

## Instalación

### Requisitos

- Node.js y npm compatibles con el proyecto.
- Visual Studio Code o editor equivalente.
- Navegador web moderno.

### Pasos

1. Clonar el repositorio:

   git clone URL_DEL_REPOSITORIO

2. Ingresar a la carpeta del proyecto.

3. Instalar las dependencias:

   npm install

4. Ejecutar el proyecto:

   npx ng serve --open

5. Abrir en el navegador:

   http://localhost:4200

## Pruebas funcionales

Se recomienda verificar los siguientes procesos:

1. Registrar un propietario.
2. Registrar una mascota y asociarla con su propietario.
3. Agendar una cita disponible.
4. Intentar reservar un horario ocupado.
5. Confirmar una cita.
6. Registrar una atención veterinaria.
7. Comprobar que la cita cambie a ATENDIDA.
8. Consultar la atención en el historial clínico.
9. Recargar la página y verificar la persistencia de los datos.

## Almacenamiento

Actualmente, VetCare utiliza LocalStorage del navegador.

No requiere una base de datos externa ni una API backend para su funcionamiento actual.

Los registros no se sincronizan automáticamente entre diferentes dispositivos.

## Estado del proyecto

Versión académica funcional para el curso Desarrollo de Interfaces 3.
```
