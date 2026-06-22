import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [RouterLink],
  styles: [
    `
      .page {
        max-width: 860px;
      }
      .page-header {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #e2e8f0;
      }
      .badge-row {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
      .badge {
        display: inline-block;
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.04em;
      }
      .badge-red {
        background: #fee2e2;
        color: #dc2626;
      }
      .badge-blue {
        background: #dbeafe;
        color: #1d4ed8;
      }
      .badge-green {
        background: #dcfce7;
        color: #16a34a;
      }
      .page-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      .page-subtitle {
        font-size: 1rem;
        color: #64748b;
        max-width: 620px;
      }
      h2 {
        font-size: 1.25rem;
        margin: 2rem 0 0.75rem;
        color: #1e293b;
      }
      .arch-diagram {
        background: #0b1120;
        color: #cbd5e1;
        padding: 1.5rem;
        border-radius: 8px;
        font-family: 'JetBrains Mono', Consolas, monospace;
        font-size: 0.82rem;
        white-space: pre;
        overflow-x: auto;
        margin: 1rem 0 1.5rem;
        line-height: 1.6;
        border: 1px solid #1e293b;
      }
      .packages-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
        gap: 0.875rem;
        margin: 1rem 0 1.5rem;
      }
      .package-card {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 1rem;
        transition: border-color 0.15s;
        &:hover {
          border-color: #2563eb;
        }
      }
      .package-name {
        font-family: 'JetBrains Mono', Consolas, monospace;
        font-size: 0.82rem;
        font-weight: 700;
        color: #2563eb;
        margin-bottom: 0.2rem;
      }
      .package-port {
        font-size: 0.75rem;
        color: #94a3b8;
        margin-bottom: 0.5rem;
      }
      .package-desc {
        font-size: 0.85rem;
        color: #475569;
        line-height: 1.5;
      }
      .learn-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin: 1rem 0 1.5rem;
      }
      .learn-item {
        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
        padding: 0.75rem 1rem;
        background: #f8fafc;
        border-radius: 6px;
        border-left: 3px solid #2563eb;
      }
      .learn-icon {
        font-size: 1rem;
        margin-top: 1px;
      }
      .learn-text {
        font-size: 0.875rem;
        color: #334155;
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
      <div class="page-header">
        <div class="badge-row">
          <span class="badge badge-red">Angular 21</span>
          <span class="badge badge-blue">Native Federation 21.2</span>
          <span class="badge badge-green">MIT License</span>
        </div>
        <h1 class="page-title">Angular MFE Starter Kit</h1>
        <p class="page-subtitle">
          Implementação de produção mínima de Microfrontends com Angular 21 e Native
          Federation em topologia polyrepo. Cada decisão técnica está documentada com o
          "por quê".
        </p>
      </div>

      <h2>O que é este projeto?</h2>
      <p>
        A maioria dos tutoriais de Microfrontend mostra dois botões numa tela e chama de
        "MFE". Este repo é diferente: é uma <strong>implementação de produção mínima</strong>
        com shell real, múltiplos remotes com deploy independente, comunicação cross-MFE sem
        acoplamento e estratégia de dependências compartilhadas documentada.
      </p>
      <p>
        Todo o código tem comentários explicando o <strong>"por quê"</strong>, não apenas o
        "o quê". Use como referência arquitetural, template de projeto, ou material de estudo.
      </p>

      <h2>Arquitetura</h2>
      <div class="arch-diagram">{{ architectureDiagram }}</div>

      <h2>Comunicação cross-MFE sem import direto</h2>
      <p>
        Nenhum remote importa código do outro. Toda comunicação passa pelo
        <code>EventBus</code> em <code>&#64;org/contracts</code>:
      </p>
      <div class="arch-diagram">{{ communicationDiagram }}</div>

      <h2>Pacotes</h2>
      <div class="packages-grid">
        @for (pkg of packages; track pkg.name) {
          <div class="package-card">
            <div class="package-name">{{ pkg.name }}</div>
            <div class="package-port">{{ pkg.port }}</div>
            <div class="package-desc">{{ pkg.desc }}</div>
          </div>
        }
      </div>

      <h2>O que você vai aprender</h2>
      <div class="learn-list">
        @for (item of learnings; track item.text) {
          <div class="learn-item">
            <span class="learn-icon">{{ item.icon }}</span>
            <span class="learn-text">{{ item.text }}</span>
          </div>
        }
      </div>

      <div class="nav-buttons">
        <a routerLink="/quick-start" class="btn btn-primary">Quick Start →</a>
        <a routerLink="/concepts/federation" class="btn btn-secondary">Conceitos Técnicos</a>
      </div>
    </div>
  `,
})
export class OverviewComponent {
  readonly architectureDiagram = `Browser
   │
   ▼
┌─────────────────────────────────────┐
│  Shell (host) — localhost:4200       │
│  router + federation.manifest.json  │
└──────┬───────────────┬──────────────┘
       │               │
       ▼               ▼
┌─────────────┐  ┌──────────────┐
│ mfe-products│  │ mfe-checkout │
│  :4201      │  │  :4202       │
│ remoteEntry │  │ remoteEntry  │
└─────────────┘  └──────────────┘
       │               │
       └───────┬───────┘
               ▼
   ┌───────────────────────────┐
   │   Dependências via        │
   │     Import Map            │
   │  @angular/*  (singleton)  │
   │  rxjs, tslib (singleton)  │
   │  @org/contracts (single.) │
   └───────────────────────────┘`;

  readonly communicationDiagram = `mfe-products ──emit(PRODUCT_SELECTED)──► EventBus ──► mfe-checkout (atualiza carrinho)
                                                  └──► shell header (badge numérico)`;

  readonly packages = [
    {
      name: 'mfe-shell',
      port: 'Porta 4200 — Host',
      desc: 'Layout, router, manifest de federação. Orquestra os remotes e define as rotas lazy.',
    },
    {
      name: 'mfe-products',
      port: 'Porta 4201 — Remote',
      desc: 'Lista de produtos. Emite eventos PRODUCT_SELECTED via EventBus.',
    },
    {
      name: 'mfe-checkout',
      port: 'Porta 4202 — Remote',
      desc: 'Carrinho de compras. Assina PRODUCT_SELECTED, emite CART_UPDATED para o shell.',
    },
    {
      name: '@org/contracts',
      port: 'Biblioteca TypeScript',
      desc: 'EventBusService, discriminated union MfeEvent, modelos Product e CartItem.',
    },
    {
      name: 'mfe-docs',
      port: 'Porta 4203 — Docs',
      desc: 'Este site de documentação. Angular standalone sem Native Federation.',
    },
  ];

  readonly learnings = [
    {
      icon: '⚡',
      text: 'Por que initFederation() DEVE rodar antes de bootstrapApplication() — e o que acontece se não rodar',
    },
    {
      icon: '🗺️',
      text: 'Como o Import Map injeta URLs de remotes em runtime no browser sem rebuild do shell',
    },
    {
      icon: '📦',
      text: 'Estratégia de shared deps: quando usar strictVersion: true vs false, e por quê Angular exige true',
    },
    {
      icon: '📡',
      text: 'Como remotes se comunicam via EventBus sem importar código um do outro (zero acoplamento)',
    },
    {
      icon: '🛡️',
      text: 'Error boundary por rota: o shell continua funcionando quando um remote fica offline',
    },
    {
      icon: '🚀',
      text: 'CI/CD independente: cada remote faz deploy e atualiza o manifest sem rebuildar o shell',
    },
  ];
}
