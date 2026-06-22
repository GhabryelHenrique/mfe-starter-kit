import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

// ShellLayoutComponent é o frame persistente de todos os MFEs.
// O router-outlet aqui é onde os remotes renderizam.
@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header />
    <main class="shell-content">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [`
    .shell-content {
      min-height: calc(100vh - 108px);
      padding: 2rem;
      background: #f5f5f5;
    }
  `],
})
export class ShellLayoutComponent {}
