import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

@Component({
  selector: 'app-concept-shared-deps',
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
      .comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin: 1rem 0 1.5rem;
      }
      .comparison-card {
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid #e2e8f0;
      }
      .comparison-card.danger {
        background: #fef2f2;
        border-color: #fecaca;
      }
      .comparison-card.safe {
        background: #f0fdf4;
        border-color: #bbf7d0;
      }
      .comparison-label {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 0.5rem;
      }
      .comparison-card.danger .comparison-label {
        color: #dc2626;
      }
      .comparison-card.safe .comparison-label {
        color: #16a34a;
      }
      .comparison-text {
        font-size: 0.85rem;
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
      <h1 class="page-title">Shared Dependencies</h1>
      <p class="page-subtitle">
        Como compartilhar libs entre shell e remotes sem duplicar bundles, quando usar
        <code>strictVersion: true</code> e o bug silencioso sem <code>singleton: true</code>.
      </p>

      <h2>O problema sem shared deps</h2>
      <p>
        Sem configuração de dependências compartilhadas, cada remote baixa sua própria cópia
        de <code>&#64;angular/core</code>, <code>rxjs</code> etc. O resultado:
      </p>
      <ul>
        <li>Bundle total explode (Angular duplicado = ~200KB a mais)</li>
        <li>O sistema de injeção de dependências do Angular quebra — cada cópia tem seu próprio <code>ApplicationRef</code>, <code>Injector</code> e providers</li>
        <li>O EventBus para de funcionar — cada remote tem sua própria instância do Subject</li>
      </ul>

      <h2>shareAll() — a baseline</h2>
      <p>
        <code>shareAll()</code> instrui Native Federation a usar a versão já carregada de uma
        lib em vez de baixar uma nova. O shell carrega uma lib → o remote reutiliza.
      </p>
      <app-code-block [code]="shareAllCode" filename="federation.config.js (padrão em todos os pacotes)" />

      <h2>strictVersion: false vs true</h2>
      <table>
        <thead>
          <tr>
            <th>Configuração</th>
            <th>Comportamento</th>
            <th>Quando usar</th>
          </tr>
        </thead>
        <tbody>
          @for (row of strictVersionTable; track row.config) {
            <tr>
              <td><code>{{ row.config }}</code></td>
              <td>{{ row.behavior }}</td>
              <td>{{ row.when }}</td>
            </tr>
          }
        </tbody>
      </table>

      <h2>Por que Angular exige strictVersion: true</h2>
      <p>
        O sistema de DI do Angular é global por design. O <code>Injector</code> raiz é criado
        uma única vez no bootstrap e todos os providers são registrados nele. Se o shell
        carrega Angular 21.0.3 e um remote carrega Angular 21.1.0 (versões diferentes com
        <code>strictVersion: false</code>), o remote pode usar <em>uma segunda instância</em>
        do runtime — e providers do shell não existem nessa instância.
      </p>
      <div class="alert">
        <strong>Efeito prático</strong>
        Angular carregado duas vezes aparece no console como "Warning: Angular loaded twice".
        Services com providedIn: 'root' têm instâncias diferentes no shell e no remote.
        Tokens de injeção não são reconhecidos entre fronteiras de instância.
      </div>
      <app-code-block [code]="angularStrictCode" filename="federation.config.js — override para Angular" />

      <h2>Por que &#64;org/contracts precisa de singleton: true</h2>
      <p>
        O <code>EventBusService</code> usa um padrão de singleton em nível de módulo JS:
      </p>
      <app-code-block [code]="singletonPatternCode" filename="packages/mfe-contracts/src/lib/event-bus.service.ts" />

      <div class="comparison">
        <div class="comparison-card danger">
          <div class="comparison-label">❌ Sem singleton federation</div>
          <div class="comparison-text">
            Cada remote recebe sua própria cópia de <code>&#64;org/contracts</code>.
            A variável <code>_instance</code> existe 3 vezes no browser (shell + 2 remotes).
            <code>emit()</code> num Subject não chega nos outros.
          </div>
        </div>
        <div class="comparison-card safe">
          <div class="comparison-label">✓ Com singleton: true</div>
          <div class="comparison-text">
            O browser carrega <code>&#64;org/contracts</code> uma única vez.
            <code>_instance</code> existe apenas uma vez.
            <code>emit()</code> em qualquer remote chega no shell e nos outros remotes.
          </div>
        </div>
      </div>

      <div class="info-box">
        <strong>Como verificar em runtime</strong>
        Abra o DevTools → Network → filtre por <code>contracts</code>. Deve aparecer apenas
        uma requisição para o bundle. Se aparecer mais de uma, <code>singleton: true</code>
        está faltando em algum <code>federation.config.js</code>.
      </div>

      <h2>Configuração completa do shell</h2>
      <app-code-block [code]="fullShellConfigCode" filename="packages/mfe-shell/federation.config.js" />

      <div class="nav-buttons">
        <a routerLink="/concepts/event-bus" class="btn btn-primary">Event Bus →</a>
        <a routerLink="/concepts/federation" class="btn btn-secondary">← Native Federation</a>
      </div>
    </div>
  `,
})
export class ConceptSharedDepsComponent {
  readonly shareAllCode = `import { shareAll } from '@angular-architects/native-federation';

shared: {
  // Baseline: compartilha tudo com tolerância a minor/patch divergentes
  ...shareAll({ singleton: true, strictVersion: false, requiredVersion: 'auto' }),

  // Override para Angular — DI system exige instância única, zero tolerância
  '@angular/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/router': { singleton: true, strictVersion: true, requiredVersion: 'auto' },

  // @org/contracts — singleton obrigatório para o EventBus funcionar
  '@org/contracts': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
}`;

  readonly strictVersionTable = [
    {
      config: 'strictVersion: false',
      behavior: 'Versões diferentes coexistem; a versão do host é usada. Sem erro.',
      when: 'rxjs, tslib, libs utilitárias sem estado global',
    },
    {
      config: 'strictVersion: true',
      behavior: 'Versão diferente da esperada gera erro em runtime imediatamente.',
      when: 'Angular core, @org/contracts — qualquer lib com estado global',
    },
    {
      config: 'singleton: true',
      behavior: 'Apenas 1 instância do módulo no browser. Garante estado compartilhado.',
      when: 'Tudo que tiver Subject, BehaviorSubject, Injector, store global',
    },
  ];

  readonly angularStrictCode = `// federation.config.js
shared: {
  ...shareAll({ singleton: true, strictVersion: false, requiredVersion: 'auto' }),

  // Override: Angular precisa de strictVersion: true
  // Se o remote tiver uma versão diferente, erro imediato é melhor que bug silencioso
  '@angular/core':              { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/common':            { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/common/http':       { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/router':            { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/platform-browser':  { singleton: true, strictVersion: true, requiredVersion: 'auto' },
}`;

  readonly singletonPatternCode = `// A variável _instance existe no escopo do módulo JS
// Se @org/contracts for carregado duas vezes, existem DOIS _instance separados
let _instance: EventBusService | null = null;

export class EventBusService {
  private readonly _bus$ = new Subject<MfeEvent>();
  private constructor() {}  // private: ninguém pode fazer new EventBusService()

  static getInstance(): EventBusService {
    if (!_instance) {
      _instance = new EventBusService();
    }
    return _instance;
  }

  emit(event: MfeEvent): void { this._bus$.next(event); }

  on<K extends MfeEvent['type']>(type: K): Observable<Extract<MfeEvent, { type: K }>> {
    return this._bus$.pipe(
      filter((e): e is Extract<MfeEvent, { type: K }> => e.type === type)
    );
  }
}`;

  readonly fullShellConfigCode = `const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  // Host não tem name nem exposes — só consome remotes
  remotes: {},

  shared: {
    ...shareAll({ singleton: true, strictVersion: false, requiredVersion: 'auto' }),

    '@angular/core':              { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/common':            { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/common/http':       { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/router':            { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/platform-browser':  { singleton: true, strictVersion: true, requiredVersion: 'auto' },

    // Singleton obrigatório — EventBus é um Subject no escopo deste módulo
    '@org/contracts': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  },

  skip: [
    'rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket',
  ],
});`;
}
