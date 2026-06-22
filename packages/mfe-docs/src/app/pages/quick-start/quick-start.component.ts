import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../shared/code-block/code-block.component';

@Component({
  selector: 'app-quick-start',
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
      }
      h3 {
        font-size: 1rem;
        font-weight: 600;
        margin: 1.5rem 0 0.5rem;
        color: #334155;
      }
      .prereq-table {
        width: 100%;
        border-collapse: collapse;
        margin: 0.75rem 0 1.5rem;
        font-size: 0.875rem;
      }
      .prereq-table th {
        text-align: left;
        padding: 0.5rem 0.75rem;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        font-size: 0.75rem;
        font-weight: 700;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .prereq-table td {
        padding: 0.5rem 0.75rem;
        border: 1px solid #e2e8f0;
      }
      .step-list {
        list-style: none;
        padding: 0;
        margin: 0;
        counter-reset: steps;
      }
      .step-item {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        counter-increment: steps;
      }
      .step-number {
        width: 2rem;
        height: 2rem;
        min-width: 2rem;
        background: #2563eb;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.875rem;
        margin-top: 2px;
      }
      .step-content {
        flex: 1;
      }
      .step-title {
        font-weight: 600;
        color: #0f172a;
        margin-bottom: 0.3rem;
        font-size: 0.95rem;
      }
      .step-desc {
        font-size: 0.875rem;
        color: #64748b;
        margin-bottom: 0.5rem;
      }
      .demo-steps {
        list-style: none;
        padding: 0;
        margin: 0;
        counter-reset: demo;
      }
      .demo-step {
        display: flex;
        gap: 0.75rem;
        padding: 0.625rem 0;
        border-bottom: 1px solid #f1f5f9;
        counter-increment: demo;
        align-items: flex-start;
        &:last-child {
          border-bottom: none;
        }
      }
      .demo-num {
        width: 1.5rem;
        height: 1.5rem;
        min-width: 1.5rem;
        background: #eff6ff;
        color: #2563eb;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.75rem;
        margin-top: 1px;
      }
      .demo-text {
        font-size: 0.875rem;
        color: #334155;
        line-height: 1.5;
      }
      .info-box {
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        border-radius: 8px;
        padding: 1rem 1.25rem;
        margin: 1rem 0 1.5rem;
        font-size: 0.875rem;
        color: #1e40af;
      }
      .info-box strong {
        display: block;
        margin-bottom: 0.25rem;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
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
      <h1 class="page-title">Quick Start</h1>
      <p class="page-subtitle">
        Tudo rodando em menos de 2 minutos com cache npm quente.
      </p>

      <h2>Pré-requisitos</h2>
      <table class="prereq-table">
        <thead>
          <tr>
            <th>Ferramenta</th>
            <th>Versão mínima</th>
            <th>Verificar</th>
          </tr>
        </thead>
        <tbody>
          @for (req of prereqs; track req.tool) {
            <tr>
              <td><strong>{{ req.tool }}</strong></td>
              <td><code>{{ req.version }}</code></td>
              <td><code>{{ req.check }}</code></td>
            </tr>
          }
        </tbody>
      </table>

      <app-code-block [code]="installCliCode" filename="Instalar Angular CLI (se necessário)" />

      <h2>Instalação e execução</h2>
      <ol class="step-list">
        @for (step of steps; track step.title; let i = $index) {
          <li class="step-item">
            <span class="step-number">{{ i + 1 }}</span>
            <div class="step-content">
              <div class="step-title">{{ step.title }}</div>
              <div class="step-desc">{{ step.desc }}</div>
              <app-code-block [code]="step.code" [filename]="step.filename" />
            </div>
          </li>
        }
      </ol>

      <div class="info-box">
        <strong>Tempo estimado</strong>
        Primeiro run: ~2–4 min (baixa 4 node_modules). Com cache npm: &lt; 30s.
        Todos os 4 processos sobem em paralelo com saída colorida no terminal.
      </div>

      <h2>Como testar o Event Bus</h2>
      <p>
        Este é o demo central do projeto: comunicação cross-MFE sem import direto.
        Siga os passos abaixo para ver o Event Bus em ação:
      </p>
      <ol class="demo-steps">
        @for (step of demoSteps; track step.text; let i = $index) {
          <li class="demo-step">
            <span class="demo-num">{{ i + 1 }}</span>
            <span class="demo-text">{{ step.text }}</span>
          </li>
        }
      </ol>

      <h2>Documentação interativa</h2>
      <p>
        Para ver este site de docs em outro terminal, enquanto os remotes estão rodando:
      </p>
      <app-code-block [code]="docsCode" filename="Terminal separado" />

      <div class="nav-buttons">
        <a routerLink="/concepts/federation" class="btn btn-primary">Conceitos Técnicos →</a>
        <a routerLink="/faq" class="btn btn-secondary">Troubleshooting</a>
      </div>
    </div>
  `,
})
export class QuickStartComponent {
  readonly prereqs = [
    { tool: 'Node.js', version: '20.x ou superior', check: 'node -v' },
    { tool: 'npm', version: '10.x ou superior', check: 'npm -v' },
    { tool: 'Angular CLI', version: '21.x (global)', check: 'ng version' },
  ];

  readonly installCliCode = `npm install -g @angular/cli@^21`;

  readonly steps = [
    {
      title: 'Clone o repositório',
      desc: '',
      filename: '',
      code: `git clone https://github.com/GhabryelHenrique/mfe-starter-kit.git
cd mfe-starter-kit`,
    },
    {
      title: 'Instala dependências de todos os pacotes',
      desc: 'Instala root + mfe-contracts + mfe-shell + mfe-products + mfe-checkout + mfe-docs em sequência.',
      filename: '',
      code: `npm run install:all`,
    },
    {
      title: 'Compila @org/contracts',
      desc: 'OBRIGATÓRIO antes de subir os apps Angular — eles dependem do dist/ desta lib.',
      filename: '',
      code: `npm run build:contracts`,
    },
    {
      title: 'Sobe todos os pacotes em paralelo',
      desc: 'Usa concurrently para subir mfe-contracts (watch) + shell + products + checkout simultaneamente.',
      filename: '',
      code: `npm run dev`,
    },
    {
      title: 'Abra o shell',
      desc: 'O shell redireciona automaticamente para /products.',
      filename: '',
      code: `# Abra no browser:
http://localhost:4200`,
    },
  ];

  readonly demoSteps = [
    { text: 'Acesse http://localhost:4200 — redireciona para /products (mfe-products em :4201)' },
    { text: 'Clique "Adicionar ao Carrinho" em qualquer produto' },
    {
      text: 'Observe o badge numérico no header do shell atualizar em tempo real — o shell não sabe nada sobre mfe-products, mas recebe o evento CART_UPDATED via EventBus',
    },
    { text: 'Navegue para /checkout — o item aparece no carrinho (mfe-checkout em :4202)' },
    {
      text: 'Clique "Limpar Carrinho" — o badge volta a zero. Nenhuma dessas ações envolve import direto entre os remotes.',
    },
  ];

  readonly docsCode = `npm run docs
# Abre http://localhost:4203`;
}
