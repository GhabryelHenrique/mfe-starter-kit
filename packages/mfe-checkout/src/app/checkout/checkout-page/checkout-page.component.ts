// checkout-page.component.ts — Assina eventos de mfe-products via EventBus.
//
// DEMONSTRAÇÃO DO PADRÃO DE COMUNICAÇÃO CROSS-MFE:
// Este componente recebe itens adicionados ao carrinho de mfe-products
// SEM importar nada daquele pacote. O único import compartilhado é
// @org/contracts — o contrato.
//
// ANTI-PADRÃO evitado:
//   import { ProductsListComponent } from 'mfe-products/...'  // ← NUNCA faça isso
//
// PADRÃO CORRETO:
//   bus.on('PRODUCT_SELECTED')  // ← tipado via discriminated union em @org/contracts

import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { EVENT_BUS } from '../../core/tokens/event-bus.token';
import { CartItem } from '@org/contracts';
import { Subscription } from 'rxjs';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CartComponent],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  private readonly bus = inject(EVENT_BUS);
  private subscription?: Subscription;

  // Estado reativo do carrinho via signals do Angular 21.
  readonly cartItems = signal<CartItem[]>([]);
  readonly totalPrice = signal(0);
  readonly totalQuantity = signal(0);

  ngOnInit(): void {
    // Assina PRODUCT_SELECTED emitido por mfe-products.
    // Cada seleção adiciona uma unidade ao estado local do carrinho.
    this.subscription = this.bus.on('PRODUCT_SELECTED').subscribe((event) => {
      const product = event.payload;

      this.cartItems.update((items) => {
        const existing = items.find((i) => i.product.id === product.id);
        if (existing) {
          return items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...items, { product, quantity: 1 }];
      });

      this.recalculate();
    });
  }

  onClearCart(): void {
    this.cartItems.set([]);
    this.totalPrice.set(0);
    this.totalQuantity.set(0);

    // Publica CART_CLEARED para o badge do header do shell zerar.
    this.bus.emit({ type: 'CART_CLEARED' });
  }

  private recalculate(): void {
    const items = this.cartItems();
    const qty = items.reduce((sum, i) => sum + i.quantity, 0);
    const price = items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );
    this.totalQuantity.set(qty);
    this.totalPrice.set(price);

    // Publica CART_UPDATED para que o badge do header do shell atualize.
    // O shell assina este evento via toSignal() em HeaderComponent.
    this.bus.emit({
      type: 'CART_UPDATED',
      payload: {
        items,
        totalQuantity: qty,
        totalPrice: price,
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
