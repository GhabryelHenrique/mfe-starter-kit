import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

@Component({
  selector: 'app-concept-federation',
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
      h3 {
        font-size: 1rem;
        font-weight: 600;
        margin: 1.25rem 0 0.5rem;
        color: #334155;
      }
      .alert {
        border-left: 4px solid #ef4444;
        background: #fef2f2;
        padding: 0.875rem 1rem;
        border-radius: 0 6px 6px 0;
        margin: 1rem 0 1.5rem;
        font-size: 0.875rem;
        color: #991b1b;
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
      .flow-diagram {
        background: #0b1120;
        color: #cbd5e1;
        padding: 1.25rem;
        border-radius: 8px;
        font-family: 'JetBrains Mono', Consolas, monospace;
        font-size: 0.8rem;
        white-space: pre;
        overflow-x: auto;
        margin: 1rem 0 1.5rem;
        line-height: 1.6;
        border: 1px solid #1e293b;
      }
      .env-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
        margin: 1rem 0 1.5rem;
      }
      .env-card {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 0.875rem;
      }
      .env-tag {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        padding: 2px 8px;
        border-radius: 4px;
        margin-bottom: 0.5rem;
        display: inline-block;
      }
      .env-tag-dev {
        background: #dcfce7;
        color: #15803d;
      }
      .env-tag-staging {
        background: #fef9c3;
        color: #854d0e;
      }
      .env-tag-prod {
        background: #fee2e2;
        color: #dc2626;
      }
      .env-urls {
        font-family: 'JetBrains Mono', Consolas, monospace;
        font-size: 0.72rem;
        color: #475569;
        line-height: 1.7;
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
      <h1 class="page-title">Native Federation</h1>
      <p class="page-subtitle">
        Como o shell carrega remotes em runtime, por que a ordem de inicialização importa e
        como o manifest seleciona URLs por ambiente.
      </p>

      <h2>O que é Native Federation?</h2>
      <p>
        Native Federation é a evolução do Module Federation para o ecossistema moderno de
        ES Modules. Em vez de depender do runtime do Webpack, ela usa o mecanismo nativo do
        browser: o <strong>Import Map</strong>.
      </p>
      <p>
        Um Import Map é uma tag <code>&lt;script type="importmap"&gt;</code> no HTML que mapeia
        especificadores de módulo (ex: <code>mfe-products/remoteEntry.json</code>) para URLs
        reais. O browser usa esse mapa para resolver <code>import()</code> dinâmicos.
      </p>
      <div class="flow-diagram">{{ importMapDiagram }}</div>

      <h2>Por que initFederation() DEVE vir antes de bootstrapApplication()</h2>

      <div class="alert">
        <strong>Regra crítica</strong>
        Se bootstrapApplication() rodar antes de initFederation(), todas as chamadas de
        loadRemoteModule() nas rotas vão falhar silenciosamente ou com erro de módulo não
        encontrado. O Import Map não existe ainda.
      </div>

      <p>
        Quando o browser carrega o shell, ele precisa saber as URLs dos remotes para resolver
        imports dinâmicos. O <code>initFederation(manifestPath)</code>:
      </p>
      <ol>
        <li>Faz fetch do manifest JSON (ex: <code>federation.manifest.dev.json</code>)</li>
        <li>Injeta um <code>&lt;script type="importmap"&gt;</code> no <code>&lt;head&gt;</code></li>
        <li>Só depois resolve a Promise, permitindo que <code>bootstrapApplication()</code> suba</li>
      </ol>

      <app-code-block [code]="mainTsCode" filename="packages/mfe-shell/src/main.ts" />

      <p>
        O <code>.catch()</code> em ambos os pontos garante que erros de rede no manifest não
        quebrem o shell silenciosamente — você vê o erro no console.
      </p>

      <h3>Remotes: initFederation sem argumento</h3>
      <p>
        Nos remotes (<code>mfe-products</code>, <code>mfe-checkout</code>),
        <code>initFederation()</code> é chamado <em>sem argumento</em>. O remote não precisa
        conhecer outros remotes — só precisa registrar seu próprio <code>remoteEntry.json</code>
        para quando for carregado isoladamente.
      </p>
      <app-code-block [code]="remoteMainCode" filename="packages/mfe-products/src/main.ts" />

      <h2>Manifest por ambiente</h2>
      <p>
        O shell não hardcoda URLs de remotes. Três arquivos JSON, um por ambiente:
      </p>
      <div class="env-grid">
        <div class="env-card">
          <span class="env-tag env-tag-dev">DEV</span>
          <div class="env-urls">localhost:4201\nlocalhost:4202</div>
        </div>
        <div class="env-card">
          <span class="env-tag env-tag-staging">STAGING</span>
          <div class="env-urls">staging.products.app\nstaging.checkout.app</div>
        </div>
        <div class="env-card">
          <span class="env-tag env-tag-prod">PROD</span>
          <div class="env-urls">cdn.products.app\ncdn.checkout.app</div>
        </div>
      </div>

      <p>
        O <code>angular.json</code> usa <code>fileReplacements</code> para trocar o arquivo
        de environment conforme a configuração de build. Cada environment aponta para o manifest
        correto:
      </p>
      <app-code-block [code]="environmentCode" filename="packages/mfe-shell/src/environments/environment.ts" />
      <app-code-block [code]="fileReplacementsCode" filename="packages/mfe-shell/angular.json (trecho)" />

      <div class="info-box">
        <strong>Por que isso importa em produção?</strong>
        Quando um remote faz deploy numa nova URL (novo CDN, novo S3 bucket), você só
        precisa atualizar <code>federation.manifest.prod.json</code> — o shell não precisa
        ser rebuildado nem redeployado. Veja <code>.github/workflows/ci-products.yml</code>
        para o padrão de automação com <code>jq</code>.
      </div>

      <h2>Como loadRemoteModule() usa o Import Map</h2>
      <app-code-block [code]="loadRemoteCode" filename="packages/mfe-shell/src/app/app.routes.ts (trecho)" />
      <p>
        Quando o router navega para <code>/products</code>, ele chama
        <code>loadRemoteModule('mfe-products', './Routes')</code>. Native Federation resolve
        <code>'mfe-products'</code> via Import Map para a URL real do <code>remoteEntry.json</code>,
        baixa o bundle e retorna o módulo <code>./Routes</code> exposto no
        <code>federation.config.js</code> do remote.
      </p>

      <div class="nav-buttons">
        <a routerLink="/concepts/shared-deps" class="btn btn-primary">Shared Deps →</a>
        <a routerLink="/concepts/event-bus" class="btn btn-secondary">Event Bus</a>
      </div>
    </div>
  `,
})
export class ConceptFederationComponent {
  readonly importMapDiagram = `initFederation(manifest)
  │
  ├── fetch('/federation.manifest.dev.json')
  │         ↓
  │   { "mfe-products": "http://localhost:4201/remoteEntry.json",
  │     "mfe-checkout": "http://localhost:4202/remoteEntry.json" }
  │
  └── injeta no <head>:
        <script type="importmap">
          {
            "imports": {
              "mfe-products/remoteEntry.json": "http://localhost:4201/remoteEntry.json",
              "mfe-checkout/remoteEntry.json": "http://localhost:4202/remoteEntry.json"
            }
          }
        </script>
        ↓
  bootstrapApplication() ← agora pode rodar com segurança`;

  readonly mainTsCode = `import { initFederation } from '@angular-architects/native-federation';
import { environment } from './environments/environment';

// initFederation() PRIMEIRO — injeta o Import Map no browser
// Sem isso, loadRemoteModule() nas rotas não saberia as URLs dos remotes
initFederation(environment.federationManifest)
  .catch((err) => console.error('[MFE Shell] Federation init failed:', err))
  .then(() => import('./bootstrap'))  // bootstrapApplication() vem DEPOIS
  .catch((err) => console.error('[MFE Shell] Bootstrap failed:', err));`;

  readonly remoteMainCode = `import { initFederation } from '@angular-architects/native-federation';

// Remote sem argumento: registra seu próprio remoteEntry
// Necessário para rodar o remote standalone (ng serve isolado)
initFederation()
  .catch(console.error)
  .then(() => import('./bootstrap'))
  .catch(console.error);`;

  readonly environmentCode = `export const environment = {
  production: false,
  // Aponta para o manifest de dev (localhost)
  federationManifest: '/federation.manifest.dev.json',
};

// environment.prod.ts aponta para federation.manifest.prod.json
// environment.staging.ts aponta para federation.manifest.staging.json`;

  readonly fileReplacementsCode = `// angular.json — configuração production
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ]
  },
  "staging": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.staging.ts"
      }
    ]
  }
}`;

  readonly loadRemoteCode = `{
  path: 'products',
  loadChildren: () =>
    loadRemoteModule('mfe-products', './Routes')
      // ↑ Native Federation resolve 'mfe-products' via Import Map
      // para http://localhost:4201/remoteEntry.json (em dev)
      .then(m => m.routes)
      .catch(() => [{ path: '**', component: RemoteErrorComponent }])
}`;
}
