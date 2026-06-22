// remote-error.component.ts — Error boundary para remotes que falham ao carregar.
//
// Exibido quando loadRemoteModule() lança erro. Causas comuns:
//   - Servidor do remote offline
//   - URL errada no manifest
//   - Incompatibilidade de versão (strictVersion: true violado)
//   - Erro de rede transitório

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-remote-error',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="error-boundary">
      <div class="error-icon">⚠</div>
      <h1>Esta seção está temporariamente indisponível</h1>
      <p>
        O módulo remoto não pôde ser carregado. Isso geralmente é um problema temporário.
        Tente novamente ou entre em contato com o suporte se o problema persistir.
      </p>
      <a routerLink="/" class="back-link">Voltar para a Home</a>
    </div>
  `,
  styles: [`
    .error-boundary {
      max-width: 480px;
      margin: 4rem auto;
      padding: 2rem;
      text-align: center;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);

      .error-icon { font-size: 3rem; margin-bottom: 1rem; }
      h1 { font-size: 1.2rem; color: #333; margin-bottom: 0.75rem; }
      p { color: #666; font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.5rem; }

      .back-link {
        display: inline-block;
        padding: 0.6rem 1.4rem;
        background: #dd0031;
        color: #fff;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        &:hover { background: #b0002a; }
      }
    }
  `],
})
export class RemoteErrorComponent {}
