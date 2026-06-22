import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// App é o componente raiz. Contém apenas router-outlet.
// O layout (header/footer) vive em ShellLayoutComponent,
// ativado pela rota raiz. Mantém app.ts mínimo.
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {}
