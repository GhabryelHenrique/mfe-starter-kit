import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

@Component({
  selector: 'app-concept-event-bus',
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
      .pattern-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin: 1rem 0 1.5rem;
      }
      .pattern-card {
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid #e2e8f0;
      }
      .pattern-card.bad {
        background: #fef2f2;
        border-color: #fecaca;
      }
      .pattern-card.good {
        background: #f0fdf4;
        border-color: #bbf7d0;
      }
      .pattern-label {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 0.5rem;
      }
      .pattern-card.bad .pattern-label {
        color: #dc2626;
      }
      .pattern-card.good .pattern-label {
        color: #16a34a;
      }
      .pattern-text {
        font-size: 0.83rem;
        color: #334155;
        line-height: 1.5;
        margin-bottom: 0.5rem;
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
      <h1 class="page-title">Event Bus</h1>
      <p class="page-subtitle">
        Como remotes se comunicam sem importar código um do outro, usando um canal de eventos
        compartilhado via <code>&#64;org/contracts</code>.
      </p>

      <h2>O problema do acoplamento direto</h2>
      <p>
        O objetivo de Microfrontends é que cada remote possa ser desenvolvido, deployado e
        testado de forma independente. Se <code>mfe-checkout</code> importar diretamente de
        <code>mfe-products</code>, isso quebra esse contrato:
      </p>
      <div class="pattern-grid">
        <div class="pattern-card bad">
          <div class="pattern-label">❌ Anti-padrão — import direto</div>
          <div class="pattern-text">
            mfe-checkout importa código de mfe-products diretamente. Deploy de products pode
            quebrar checkout. Impossível rodar checkout de forma isolada.
          </div>
        </div>
        <div class="pattern-card good">
          <div class="pattern-label">✓ Padrão correto — via contrato</div>
          <div class="pattern-text">
            mfe-checkout conhece apenas <code>&#64;org/contracts</code>. Qualquer remote que
            emita <code>PRODUCT_SELECTED</code> funciona. Deploy independente preservado.
          </div>
        </div>
      </div>
      <app-code-block [code]="antiPatternCode" language="typescript" />

      <h2>Fluxo de comunicação</h2>
      <div class="flow-diagram">{{ flowDiagram }}</div>

      <h2>O EventBusService em detalhe</h2>
      <p>
        O service usa um padrão de singleton em nível de módulo JS, combinado com
        <code>singleton: true</code> na federação para garantir que existe apenas uma
        instância em todo o browser:
      </p>
      <app-code-block [code]="eventBusCode" filename="packages/mfe-contracts/src/lib/event-bus.service.ts" />

      <h2>Discriminated union MfeEvent</h2>
      <p>
        Todos os eventos possíveis são declarados como um discriminated union. O TypeScript
        usa o campo <code>type</code> para narrowing automático no método <code>on&lt;K&gt;()</code>:
      </p>
      <app-code-block [code]="eventsCode" filename="packages/mfe-contracts/src/lib/events.ts" />

      <h2>Emitindo eventos (mfe-products)</h2>
      <app-code-block [code]="emitCode" filename="packages/mfe-products/src/app/products/products-list/products-list.component.ts" />

      <h2>Assinando eventos (mfe-checkout)</h2>
      <app-code-block [code]="subscribeCode" filename="packages/mfe-checkout/src/app/checkout/checkout-page/checkout-page.component.ts" />

      <h2>Badge reativo no shell (toSignal)</h2>
      <p>
        O shell header assina <code>CART_UPDATED</code> e usa <code>toSignal()</code> para
        manter o badge atualizado de forma reativa, sem <code>ngOnInit</code> nem
        <code>subscribe()</code> manual:
      </p>
      <app-code-block [code]="shellBadgeCode" filename="packages/mfe-shell/src/app/layout/header/header.component.ts" />

      <div class="info-box">
        <strong>Por que Subject e não BehaviorSubject?</strong>
        BehaviorSubject emite o último valor para novos assinantes. Se o shell carregasse
        depois de um PRODUCT_SELECTED, receberia um evento "do passado" e iniciaria com
        estado incorreto. Subject só emite para assinantes <em>ativos no momento do emit</em>,
        o que é o comportamento correto para eventos de ação.
      </div>

      <h2>InjectionToken no shell</h2>
      <p>
        O shell usa um <code>InjectionToken</code> para injetar o EventBus via DI, em vez de
        chamar <code>getInstance()</code> diretamente em cada componente:
      </p>
      <app-code-block [code]="tokenCode" filename="packages/mfe-shell/src/app/core/tokens/event-bus.token.ts" />

      <div class="nav-buttons">
        <a routerLink="/concepts/error-boundary" class="btn btn-primary">Error Boundary →</a>
        <a routerLink="/concepts/shared-deps" class="btn btn-secondary">← Shared Deps</a>
      </div>
    </div>
  `,
})
export class ConceptEventBusComponent {
  readonly flowDiagram = `                     ┌────────────────────────────────────┐
                     │        @org/contracts              │
                     │  EventBusService (singleton)       │
                     │  Subject<MfeEvent>                 │
                     └────────────────────────────────────┘
                                   ▲          │
                                   │          │
               emit(PRODUCT_SELECTED)    on('CART_UPDATED').subscribe()
                                   │          │
                                   │          ▼
┌─────────────────┐         ┌──────────────────────┐
│  mfe-products   │         │     mfe-shell         │
│ (addToCart btn) │         │  (header badge)        │
└─────────────────┘         └──────────────────────┘
                                   │
                     on('PRODUCT_SELECTED').subscribe()
                                   │
                                   ▼
                     ┌──────────────────────┐
                     │    mfe-checkout       │
                     │ (atualiza cartItems)  │
                     │ emit(CART_UPDATED)    │──► shell header badge
                     └──────────────────────┘`;

  readonly antiPatternCode = `// ❌ NUNCA faça isso em mfe-checkout
// Cria dependência de deploy entre os dois remotes
import { ProductsListComponent } from 'mfe-products/src/app/products/...'

// ✅ mfe-checkout conhece apenas o contrato
import { EventBusService } from '@org/contracts';

// Nota: o shell provê o EventBus via InjectionToken, não importa @org/contracts diretamente`;

  readonly eventBusCode = `import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import type { MfeEvent } from './events';

// Variável no escopo do módulo JS — existe UMA VEZ se @org/contracts tiver singleton: true
let _instance: EventBusService | null = null;

export class EventBusService {
  private readonly _bus$ = new Subject<MfeEvent>();
  private constructor() {}

  static getInstance(): EventBusService {
    if (!_instance) { _instance = new EventBusService(); }
    return _instance;
  }

  emit(event: MfeEvent): void {
    this._bus$.next(event);
  }

  get events$(): Observable<MfeEvent> {
    return this._bus$.asObservable();
  }

  // on<K>() usa discriminated union para narrowing automático do payload
  // on('PRODUCT_SELECTED') retorna Observable<ProductSelectedEvent>
  // on('CART_UPDATED') retorna Observable<CartUpdatedEvent>
  on<K extends MfeEvent['type']>(type: K): Observable<Extract<MfeEvent, { type: K }>> {
    return this._bus$.pipe(
      filter((e): e is Extract<MfeEvent, { type: K }> => e.type === type)
    );
  }
}`;

  readonly eventsCode = `export interface ProductSelectedEvent {
  type: 'PRODUCT_SELECTED';
  payload: Product;
}

export interface CartUpdatedEvent {
  type: 'CART_UPDATED';
  payload: { items: CartItem[]; totalQuantity: number; totalPrice: number };
}

export interface CartClearedEvent {
  type: 'CART_CLEARED';
  payload: null;
}

// Discriminated union — o campo 'type' é a discriminante
export type MfeEvent = ProductSelectedEvent | CartUpdatedEvent | CartClearedEvent;`;

  readonly emitCode = `// ProductsListComponent — mfe-products
addToCart(product: Product): void {
  // emit() aceita apenas MfeEvent — TypeScript valida o shape em compile time
  this.bus.emit({
    type: 'PRODUCT_SELECTED',  // ← discriminante
    payload: product,          // ← TypeScript sabe que payload é Product
  });
}`;

  readonly subscribeCode = `// CheckoutPageComponent — mfe-checkout
ngOnInit(): void {
  // on<K>() retorna Observable<ProductSelectedEvent> — payload já tipado como Product
  this.bus.on('PRODUCT_SELECTED').subscribe(event => {
    const product = event.payload;  // TypeScript: product é Product, não MfeEvent
    this.cartItems.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { product, quantity: 1 }];
    });
    this.emitCartUpdate();
  });
}

private emitCartUpdate(): void {
  const items = this.cartItems();
  this.bus.emit({
    type: 'CART_UPDATED',
    payload: {
      items,
      totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    },
  });
}`;

  readonly shellBadgeCode = `// HeaderComponent — usa toSignal() para badge reativo sem subscribe() manual
readonly cartCount = toSignal(
  this.bus.on('CART_UPDATED').pipe(
    startWith(null),
    scan((_, e) => (e ? e.payload.totalQuantity : 0), 0)
  ),
  { initialValue: 0 }
);

// No template: {{ cartCount() > 0 ? cartCount() : '' }}`;

  readonly tokenCode = `// event-bus.token.ts — DI token para o EventBus
export const EVENT_BUS = new InjectionToken<EventBusService>('EVENT_BUS', {
  providedIn: 'root',
  // factory chama getInstance() — garante o singleton mesmo via DI
  factory: () => EventBusService.getInstance(),
});

// Uso nos componentes do shell:
// private readonly bus = inject(EVENT_BUS);`;
}
