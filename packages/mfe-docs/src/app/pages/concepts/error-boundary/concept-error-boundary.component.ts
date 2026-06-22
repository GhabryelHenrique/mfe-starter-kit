import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

@Component({
  selector: 'app-concept-error-boundary',
  standalone: true,
  imports: [RouterLink, CodeBlockComponent],
  styles: [
    `
      .page {
        max-width: 820px;
      }
      .page-title {
        font-size: 1.75rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      .page-subtitle {
        color: #64748b;
        margin-bottom: 2rem;
      }
      h2 {
        font-size: 1.2rem;
        margin: 2rem 0 0.75rem;
        color: #1e293b;
        padding-top: 1rem;
        border-top: 1px solid #f1f5f9;
      }
      h2:first-of-type {
        border-top: none;
        padding-top: 0;
      }
      .alert {
        border-left: 4px solid #f59e0b;
        background: #fffbeb;
        padding: 0.875rem 1rem;
        border-radius: 0 6px 6px 0;
        margin: 1rem 0 1.5rem;
        font-size: 0.875rem;
        color: #92400e;
      }
      .alert strong {
        display: block;
        margin-bottom: 0.25rem;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .info-box {
        border-left: 4px solid #2563eb;
        background: #eff6ff;
        padding: 0.875rem 1rem;
        border-radius: 0 6px 6px 0;
        margin: 1rem 0 1.5rem;
        font-size: 0.875rem;
        color: #1e3a8a;
      }
      .test-steps {
        list-style: none;
        padding: 0;
        margin: 0.75rem 0 1.5rem;
        counter-reset: test;
      }
      .test-step {
        display: flex;
        gap: 0.75rem;
        padding: 0.6rem 0;
        border-bottom: 1px solid #f1f5f9;
        counter-increment: test;
        &:last-child {
          border-bottom: none;
        }
      }
      .test-num {
        width: 1.5rem;
        height: 1.5rem;
        min-width: 1.5rem;
        background: #fffbeb;
        color: #d97706;
        border: 1px solid #fde68a;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.75rem;
      }
      .test-text {
        font-size: 0.875rem;
        color: #334155;
        line-height: 1.5;
      }
      .causes-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        margin: 1rem 0 1.5rem;
      }
      .cause-card {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 0.875rem;
        background: #fafafa;
      }
      .cause-title {
        font-weight: 600;
        font-size: 0.85rem;
        color: #0f172a;
        margin-bottom: 0.3rem;
      }
      .cause-text {
        font-size: 0.8rem;
        color: #64748b;
        line-height: 1.5;
      }
      .nav-buttons {
        display: flex;
        gap: 0.75rem;
        margin-top: 2.5rem;
        flex-wrap: wrap;
      }
      .btn {
        padding: 0.6rem 1.25rem;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.875rem;
        display: inline-block;
        transition: all 0.15s;
      }
      .btn-primary {
        background: #2563eb;
        color: #fff;
        &:hover {
          background: #1d4ed8;
          text-decoration: none;
        }
      }
      .btn-secondary {
        background: #f1f5f9;
        color: #1e293b;
        border: 1px solid #e2e8f0;
        &:hover {
          background: #e2e8f0;
          text-decoration: none;
        }
      }
    `,
  ],
  template: `
    <div class="page">
      <h1 class="page-title">Error Boundary</h1>
      <p class="page-subtitle">
        Como o shell sobrevive quando um remote fica offline, sem quebrar as outras rotas.
      </p>

      <h2>O problema sem error boundary</h2>
      <p>
        Sem tratamento de erro, uma falha no <code>loadRemoteModule()</code> propaga uma
        Promise rejeitada para o router do Angular. O router não sabe lidar com isso —
        a navegação falha silenciosamente ou com um erro não tratado, e o usuário vê uma
        tela em branco.
      </p>
      <p>
        Num sistema com 5 remotes, isso significa que a falha de 1 remote derruba toda a
        aplicação. Inaceitável em produção.
      </p>

      <h2>A solução: .catch() por rota</h2>
      <p>
        Cada rota que usa <code>loadRemoteModule()</code> tem um <code>.catch()</code> que
        retorna um array de rotas fallback com um componente de erro:
      </p>
      <app-code-block [code]="routesCode" filename="packages/mfe-shell/src/app/app.routes.ts" />

      <p>
        O <code>.catch()</code> intercepta qualquer rejeição da Promise — erro de rede,
        CORS, bundle inválido, timeout. O router recebe um array de rotas válido e renderiza
        o <code>RemoteErrorComponent</code>.
      </p>

      <h2>O RemoteErrorComponent</h2>
      <app-code-block [code]="errorComponentCode" filename="packages/mfe-shell/src/app/core/components/remote-error/remote-error.component.ts" />

      <div class="alert">
        <strong>Comportamento importante</strong>
        Quando o <code>RemoteErrorComponent</code> é renderizado em <code>/products</code>,
        a rota <code>/checkout</code> e todas as outras continuam funcionando normalmente.
        O error boundary é isolado por rota — a falha não contamina o resto do shell.
      </div>

      <h2>Como testar</h2>
      <ol class="test-steps">
        @for (step of testSteps; track step; let i = $index) {
          <li class="test-step">
            <span class="test-num">{{ i + 1 }}</span>
            <span class="test-text">{{ step }}</span>
          </li>
        }
      </ol>

      <h2>Causas comuns de falha</h2>
      <div class="causes-grid">
        @for (cause of causes; track cause.title) {
          <div class="cause-card">
            <div class="cause-title">{{ cause.title }}</div>
            <div class="cause-text">{{ cause.text }}</div>
          </div>
        }
      </div>

      <div class="info-box">
        <strong>Próximo nível: ErrorHandler global + Sentry</strong>
        Para produção, adicione um <code>ErrorHandler</code> personalizado que captura os
        erros do <code>.catch()</code> e envia para Sentry ou outro serviço de observability.
        O error boundary garante que o usuário não veja uma tela em branco, e o ErrorHandler
        garante que o erro chegue ao time de engenharia.
      </div>

      <div class="nav-buttons">
        <a routerLink="/packages" class="btn btn-primary">Referência de Pacotes →</a>
        <a routerLink="/concepts/event-bus" class="btn btn-secondary">← Event Bus</a>
      </div>
    </div>
  `,
})
export class ConceptErrorBoundaryComponent {
  readonly routesCode = `import { loadRemoteModule } from '@angular-architects/native-federation';
import { RemoteErrorComponent } from './core/components/remote-error/remote-error.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadChildren: () =>
      loadRemoteModule('mfe-products', './Routes')
        .then(m => m.routes)
        // ↓ remote offline/erro de rede → renderiza RemoteErrorComponent
        // As outras rotas (/checkout) continuam funcionando
        .catch(() => [{ path: '**', component: RemoteErrorComponent }]),
  },
  {
    path: 'checkout',
    loadChildren: () =>
      loadRemoteModule('mfe-checkout', './Routes')
        .then(m => m.routes)
        .catch(() => [{ path: '**', component: RemoteErrorComponent }]),
  },
];`;

  readonly errorComponentCode = `@Component({
  selector: 'app-remote-error',
  standalone: true,
  imports: [RouterLink],
  template: \`
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <h2>Remote indisponível</h2>
      <p>
        Este módulo não pôde ser carregado. Verifique se o servidor está rodando
        e tente novamente.
      </p>
      <div class="error-actions">
        <button (click)="reload()">Tentar novamente</button>
        <a routerLink="/">Voltar ao início</a>
      </div>
    </div>
  \`,
})
export class RemoteErrorComponent {
  reload(): void { window.location.reload(); }
}`;

  readonly testSteps = [
    'Com npm run dev rodando, abra http://localhost:4200 — tudo funciona normalmente',
    'Em outro terminal, localize o processo do mfe-products (:4201) e encerre-o (Ctrl+C)',
    'No browser, navegue para /products — o RemoteErrorComponent aparece em vez de uma tela em branco',
    'Navegue para /checkout — o checkout continua funcionando normalmente (error boundary isolado)',
    'Reinicie o mfe-products e recarregue /products — o remote volta a carregar',
  ];

  readonly causes = [
    {
      title: 'Remote offline',
      text: 'O processo ng serve do remote não está rodando na porta esperada.',
    },
    {
      title: 'URL errada no manifest',
      text: 'federation.manifest.dev.json aponta para uma porta/URL incorreta.',
    },
    {
      title: 'Bundle inválido',
      text: 'O build do remote falhou e o remoteEntry.json está corrompido ou ausente.',
    },
    {
      title: 'CORS bloqueado',
      text: 'Em produção, o CDN do remote não serve os headers CORS necessários.',
    },
    {
      title: 'Versão incompatível',
      text: 'strictVersion: true + versão divergente de Angular gera erro em runtime.',
    },
    {
      title: 'Timeout de rede',
      text: 'O remoteEntry.json demorou demais para responder (CDN lento ou instável).',
    },
  ];
}
