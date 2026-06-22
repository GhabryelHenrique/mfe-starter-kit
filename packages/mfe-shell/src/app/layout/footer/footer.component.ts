import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="shell-footer">
      <p>Angular MFE Starter Kit &mdash; Native Federation Polyrepo</p>
    </footer>
  `,
  styles: [`
    .shell-footer {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a2e;
      color: #666;
      font-size: 0.8rem;
    }
  `],
})
export class FooterComponent {}
