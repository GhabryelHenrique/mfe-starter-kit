import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../shared/code-block/code-block.component';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [RouterLink, CodeBlockComponent],
  styles: [
    `
      .page {
        max-width: 860px;
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
      .package-section {
        margin-bottom: 2.5rem;
        padding-bottom: 2.5rem;
        border-bottom: 1px solid #e2e8f0;
      }
      .package-section:last-of-type {
        border-bottom: none;
      }
      .package-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .package-name {
        font-family: 'JetBrains Mono', Consolas, monospace;
        font-size: 1rem;
        font-weight: 700;
        color: #0f172a;
      }
      .package-badge {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        padding: 3px 8px;
        border-radius: 4px;
      }
      .badge-host {
        background: #dbeafe;
        color: #1d4ed8;
      }
      .badge-remote {
        background: #dcfce7;
        color: #15803d;
      }
      .badge-lib {
        background: #fef3c7;
        color: #b45309;
      }
      .badge-docs {
        background: #f3e8ff;
        color: #7c3aed;
      }
      .package-port {
        font-size: 0.8rem;
        color: #94a3b8;
        font-family: 'JetBrains Mono', Consolas, monospace;
      }
      .package-desc {
        color: #475569;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }
      .files-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        margin: 0.75rem 0 1rem;
      }
      .file-item {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
      }
      .file-path {
        font-family: 'JetBrains Mono', Consolas, monospace;
        font-size: 0.72rem;
        color: #334155;
      }
      .file-desc {
        font-size: 0.72rem;
        color: #94a3b8;
      }
      h3 {
        font-size: 0.9rem;
        font-weight: 600;
        color: #334155;
        margin: 1rem 0 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.75rem;
      }
      .nav-buttons {
        display: flex;
        gap: 0.75rem;
        margin-top: 2rem;
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
      <h1 class="page-title">Referência de Pacotes</h1>
      <p class="page-subtitle">
        Detalhes de cada pacote: papel na arquitetura, porta, arquivos críticos e como rodar
        de forma isolada.
      </p>

      @for (pkg of packages; track pkg.name) {
        <div class="package-section">
          <div class="package-header">
            <span class="package-name">{{ pkg.name }}</span>
            <span class="package-badge" [class]="pkg.badgeClass">{{ pkg.role }}</span>
            @if (pkg.port) {
              <span class="package-port">:{{ pkg.port }}</span>
            }
          </div>
          <p class="package-desc">{{ pkg.description }}</p>

          <h3>Arquivos críticos</h3>
          <div class="files-grid">
            @for (file of pkg.files; track file.path) {
              <div class="file-item">
                <div>
                  <div class="file-path">{{ file.path }}</div>
                  <div class="file-desc">{{ file.desc }}</div>
                </div>
              </div>
            }
          </div>

          <h3>Rodar isolado</h3>
          <app-code-block [code]="pkg.runCode" [filename]="pkg.name" />
        </div>
      }

      <div class="nav-buttons">
        <a routerLink="/faq" class="btn btn-primary">FAQ / Troubleshooting →</a>
        <a routerLink="/concepts/error-boundary" class="btn btn-secondary">← Error Boundary</a>
      </div>
    </div>
  `,
})
export class PackagesComponent {
  readonly packages = [
    {
      name: 'mfe-shell',
      role: 'Host',
      badgeClass: 'package-badge badge-host',
      port: '4200',
      description:
        'O host da federação. Responsável pelo layout global (header, sidebar, footer), router principal com lazy-loading via loadRemoteModule(), e os manifests de federação por ambiente. É o único pacote que o usuário carrega diretamente — os remotes são carregados sob demanda pelo router.',
      files: [
        { path: 'src/main.ts', desc: 'initFederation() antes do bootstrap' },
        { path: 'federation.config.js', desc: 'Host: sem name/exposes, shared deps' },
        { path: 'public/federation.manifest.*.json', desc: '3 manifests por ambiente' },
        { path: 'src/app/app.routes.ts', desc: 'loadRemoteModule + error boundary' },
        { path: 'src/app/core/tokens/', desc: 'EVENT_BUS InjectionToken' },
        { path: 'src/app/layout/', desc: 'ShellLayout, Header (badge), Footer' },
      ],
      runCode: `cd packages/mfe-shell
ng serve --port 4200
# Requer: mfe-contracts buildado + mfe-products e mfe-checkout rodando`,
    },
    {
      name: 'mfe-products',
      role: 'Remote',
      badgeClass: 'package-badge badge-remote',
      port: '4201',
      description:
        'Remote que expõe as rotas de listagem de produtos. Emite eventos PRODUCT_SELECTED via EventBus quando o usuário clica em "Adicionar ao Carrinho". Não sabe nada sobre mfe-checkout — só conhece @org/contracts.',
      files: [
        { path: 'federation.config.js', desc: 'Remote: name + exposes ./Routes' },
        { path: 'src/main.ts', desc: 'initFederation() sem argumento (remote pattern)' },
        { path: 'src/app/app.routes.ts', desc: 'Rotas expostas pelo remote' },
        { path: 'src/app/products/', desc: 'ProductsList, ProductCard, ProductDetail' },
      ],
      runCode: `cd packages/mfe-products
ng serve --port 4201
# Pode rodar isolado: http://localhost:4201 renderiza standalone`,
    },
    {
      name: 'mfe-checkout',
      role: 'Remote',
      badgeClass: 'package-badge badge-remote',
      port: '4202',
      description:
        'Remote que expõe as rotas de checkout. Assina PRODUCT_SELECTED via EventBus e mantém o estado do carrinho em signals. Emite CART_UPDATED a cada mudança para que o shell atualize o badge no header. Zero imports de mfe-products.',
      files: [
        { path: 'federation.config.js', desc: 'Remote: name + exposes ./Routes' },
        { path: 'src/app/checkout/', desc: 'CheckoutPage, CartComponent, CartItem' },
        {
          path: 'src/app/checkout/checkout-page/checkout-page.component.ts',
          desc: 'Assina PRODUCT_SELECTED, emite CART_UPDATED',
        },
      ],
      runCode: `cd packages/mfe-checkout
ng serve --port 4202
# Carrinho inicia vazio — events de mfe-products chegam via EventBus`,
    },
    {
      name: '@org/contracts',
      role: 'Biblioteca',
      badgeClass: 'package-badge badge-lib',
      port: '',
      description:
        'Pacote TypeScript puro (sem Angular). Define o contrato de comunicação entre todos os pacotes: o EventBusService singleton, o discriminated union MfeEvent e os modelos de domínio Product e CartItem. É a única dependência que shell e remotes compartilham por tipo.',
      files: [
        { path: 'src/lib/event-bus.service.ts', desc: 'Singleton com Subject<MfeEvent>' },
        { path: 'src/lib/events.ts', desc: 'Discriminated union: MfeEvent' },
        { path: 'src/lib/models/product.ts', desc: 'interface Product' },
        { path: 'src/lib/models/cart-item.ts', desc: 'interface CartItem' },
        { path: 'tsconfig.json', desc: 'Compila para dist/ com declarações .d.ts' },
      ],
      runCode: `cd packages/mfe-contracts
npm run build          # compila uma vez
npm run build:watch    # modo watch para desenvolvimento`,
    },
    {
      name: 'docs-starter-kit',
      role: 'Docs',
      badgeClass: 'package-badge badge-docs',
      port: '4203',
      description:
        'Este site de documentação. App Angular standalone sem Native Federation. Não faz parte do sistema de remotes — é um app separado com seu próprio router, layout e estilos.',
      files: [
        { path: 'src/app/layout/', desc: 'DocsLayout, Sidebar' },
        { path: 'src/app/shared/code-block/', desc: 'CodeBlock com copy-to-clipboard' },
        { path: 'src/app/pages/', desc: '8 páginas de documentação' },
      ],
      runCode: `# Da raiz do monorepo:
npm run docs
# http://localhost:4203

# Ou diretamente:
cd packages/docs-starter-kit
ng serve --port 4203`,
    },
  ];
}
