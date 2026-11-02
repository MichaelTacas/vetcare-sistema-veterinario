
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  // Controla el submenú de Registro
  readonly registroAbierto = signal(false);

  // Controla el submenú de Citas
  readonly citasAbierto = signal(false);

  alternarRegistro(): void {
    this.registroAbierto.update(abierto => !abierto);
  }

  alternarCitas(): void {
    this.citasAbierto.update(abierto => !abierto);
  }
}
