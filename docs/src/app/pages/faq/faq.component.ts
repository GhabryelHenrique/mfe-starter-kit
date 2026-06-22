import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../shared/code-block/code-block.component';

@Component({
  selector: 'app-faq',
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
      h2 {
        font-size: 1.2rem;
        margin: 2.5rem 0 1rem;
        color: #1e293b;
        padding-top: 1rem;
        border-top: 1px solid #f1f5f9;
      }
      h2:first-of-type {
        border-top: none;
        padding-top: 0;
      }
      .faq-list {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        margin-bottom: 2rem;
      }
      .faq-item {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
      }
      .faq-symptom {
        padding: 0.875rem 1rem;
        background: #fafafa;
        border-bottom: 1px solid #e2e8f0;
        font-weight: 600;
        font-size: 0.875rem;
        color: #0f172a;
        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
      }
      .faq-symptom-icon {
        font-size: 1rem;
        margin-top: 1px;
      }
      .faq-body {
        padding: 0.875rem 1rem;
      }
      .faq-cause {
        font-size: 0.8rem;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 700;
        margin-bottom: 0.35rem;
      }
      .faq-cause-text {
        font-size: 0.875rem;
        color: #334155;
        margin-bottom: 0.75rem;
      }
      .faq-fix {
        font-size: 0.8rem;
        color: #15803d;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 700;
        margin-bottom: 0.35rem;
      }
      .faq-fix-text {
        font-size: 0.875rem;
        color: #334155;
      }
      .roadmap-list {
        list-style: none;
        padding: 0;
        margin: 1rem 0;
      }
      .roadmap-item {
        display: flex;
        gap: 0.75rem;
        padding: 0.5rem 0;
        font-size: 0.875rem;
        color: #475569;
        border-bottom: 1px solid #f8fafc;
        &:last-child {
          border-bottom: none;
        }
      }
      .roadmap-done {
        color: #0f172a;
        font-weight: 500;
      }
      .roadmap-check {
        color: #16a34a;
        font-weight: 700;
        width: 1.2rem;
      }
      .roadmap-pending .roadmap-check {
        color: #94a3b8;
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
      <h1 class="page-title">FAQ & Troubleshooting</h1>
      <p class="page-subtitle">
        Problemas comuns, causas raiz e como resolver.
      </p>

      <h2>Problemas mais comuns</h2>
      <div class="faq-list">
        @for (item of faqItems; track item.symptom) {
          <div class="faq-item">
            <div class="faq-symptom">
              <span class="faq-symptom-icon">{{ item.icon }}</span>
              <span>{{ item.symptom }}</span>
            </div>
            <div class="faq-body">
              <div class="faq-cause">Causa provável</div>
              <div class="faq-cause-text">{{ item.cause }}</div>
              <div class="faq-fix">Solução</div>
              <div class="faq-fix-text">{{ item.fix }}</div>
              @if (item.code) {
                <app-code-block [code]="item.code" />
              }
            </div>
          </div>
        }
      </div>

      <h2>Verificar saúde do sistema</h2>
      <app-code-block [code]="healthCheckCode" filename="Comandos de diagnóstico" />

      <h2>Roadmap</h2>
      <ul class="roadmap-list">
        @for (item of roadmap; track item.text) {
          <li class="roadmap-item" [class.roadmap-pending]="!item.done">
            <span class="roadmap-check">{{ item.done ? '✓' : '○' }}</span>
            <span [class.roadmap-done]="item.done">{{ item.text }}</span>
          </li>
        }
      </ul>

      <h2>Onde buscar ajuda</h2>
      <ul>
        <li>
          <strong>GitHub Issues:</strong> abra uma issue em
          <code>GhabryelHenrique/mfe-starter-kit</code> com o erro completo do console
        </li>
        <li>
          <strong>Native Federation docs:</strong> verifique a documentação do
          <code>&#64;angular-architects/native-federation</code> para issues de versão
        </li>
        <li>
          <strong>Angular Discord:</strong> canal <code>#microfrontends</code> para dúvidas
          de arquitetura
        </li>
      </ul>

      <div class="nav-buttons">
        <a routerLink="/overview" class="btn btn-primary">Voltar ao início</a>
        <a routerLink="/packages" class="btn btn-secondary">← Referência de Pacotes</a>
      </div>
    </div>
  `,
})
export class FaqComponent {
  readonly faqItems = [
    {
      icon: '🔴',
      symptom: '"Angular loaded twice" no console ou erro "inject() must be called from an injection context"',
      cause:
        'Dois pacotes têm versões diferentes de @angular/core, ou singleton: true está faltando em algum federation.config.js.',
      fix: 'Verifique o federation.config.js de todos os pacotes. @angular/core deve ter singleton: true e strictVersion: true em shell, mfe-products e mfe-checkout.',
      code: `// federation.config.js — em TODOS os pacotes (shell + remotes)
'@angular/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
'@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
'@angular/router': { singleton: true, strictVersion: true, requiredVersion: 'auto' },`,
    },
    {
      icon: '🟡',
      symptom: 'Error boundary (RemoteErrorComponent) aparece ao navegar para /products ou /checkout',
      cause: 'O remote não está rodando na porta esperada, ou a URL no manifest está incorreta.',
      fix: 'Confirme que npm run dev está rodando. Verifique federation.manifest.dev.json e que as portas 4201/4202 estão livres.',
      code: `# Verificar portas em uso (Windows)
netstat -ano | findstr :4201
netstat -ano | findstr :4202

# Verificar manifest
cat packages/mfe-shell/public/federation.manifest.dev.json`,
    },
    {
      icon: '🟡',
      symptom: 'Badge do header não atualiza / evento CART_UPDATED não chega no shell',
      cause:
        '@org/contracts não está declarado no shared config de algum pacote, ou singleton: true está ausente.',
      fix: 'Adicione @org/contracts com singleton: true no federation.config.js de todos os pacotes que usam EventBus.',
      code: `// federation.config.js — em TODOS os pacotes
'@org/contracts': { singleton: true, strictVersion: true, requiredVersion: 'auto' },`,
    },
    {
      icon: '🔴',
      symptom: 'Erro "Unsatisfied version constraint" em runtime',
      cause:
        'Versões do Angular divergentes entre shell e remote com strictVersion: true configurado.',
      fix: 'Sincronize a versão de @angular/* no package.json de todos os pacotes para a mesma versão exata.',
      code: `# Verificar versões instaladas
cd packages/mfe-shell && node -e "console.log(require('./node_modules/@angular/core/package.json').version)"
cd packages/mfe-products && node -e "console.log(require('./node_modules/@angular/core/package.json').version)"`,
    },
    {
      icon: '🟠',
      symptom: 'npm run build:contracts falha com "Cannot find module typescript"',
      cause: 'As dependências de mfe-contracts não foram instaladas.',
      fix: 'Execute npm run install:all na raiz, ou npm install diretamente em packages/mfe-contracts.',
      code: null,
    },
    {
      icon: '🟠',
      symptom: 'Cannot find module "@org/contracts" ao buildar mfe-shell ou mfe-products',
      cause:
        'O mfe-contracts não foi buildado (dist/ não existe), ou npm install não foi executado após a compilação.',
      fix: 'Execute npm run build:contracts na raiz. A referência "file:../mfe-contracts" no package.json resolve para o dist/ gerado.',
      code: `# Na raiz do monorepo
npm run build:contracts
# Depois, se necessário
cd packages/mfe-shell && npm install`,
    },
  ];

  readonly healthCheckCode = `# 1. Verificar versões
node -v && npm -v && ng version

# 2. Verificar que contracts está buildado
ls packages/mfe-contracts/dist/

# 3. Verificar processos nas portas corretas
# Windows:
netstat -ano | findstr "4200 4201 4202 4203"

# 4. Testar remoteEntry diretamente
curl http://localhost:4201/remoteEntry.json
curl http://localhost:4202/remoteEntry.json

# 5. Build de produção (smoke test)
cd packages/mfe-shell && ng build --configuration production
cd packages/mfe-products && ng build --configuration production
cd packages/mfe-checkout && ng build --configuration production`;

  readonly roadmap = [
    { done: true, text: 'MVP: shell + 2 remotes + event bus' },
    { done: true, text: 'Comunicação cross-MFE via @org/contracts' },
    { done: true, text: 'Manifest por ambiente (dev / staging / prod)' },
    { done: true, text: 'Error boundary por rota' },
    { done: true, text: 'CI/CD independente por remote (.github/workflows/)' },
    { done: true, text: 'App de documentação (docs-starter-kit)' },
    { done: false, text: 'mfe-dashboard (terceiro remote de exemplo)' },
    { done: false, text: 'Auth guard integrado (JWT + interceptor no shell)' },
    { done: false, text: 'Testes e2e com Playwright (shell carrega remotes reais)' },
    { done: false, text: 'GitHub Packages publish pipeline para @org/contracts' },
  ];
}
