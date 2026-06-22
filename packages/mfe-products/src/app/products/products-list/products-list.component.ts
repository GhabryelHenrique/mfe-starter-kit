import { Component, inject } from '@angular/core';
import { Product } from '@org/contracts';
import { EVENT_BUS } from '../../core/tokens/event-bus.token';
import { MOCK_PRODUCTS } from '../products.mock';
import { ProductCardComponent } from '../product-card/product-card.component';

// ProductsListComponent — renderiza a grade de produtos e publica eventos.
// NÃO conhece mfe-checkout. Comunicação via event bus.
@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  private readonly bus = inject(EVENT_BUS);
  readonly products = MOCK_PRODUCTS;

  addToCart(product: Product): void {
    // Publicar PRODUCT_SELECTED permite que QUALQUER assinante (mfe-checkout,
    // badge do header do shell) reaja sem acoplamento a este componente.
    this.bus.emit({
      type: 'PRODUCT_SELECTED',
      payload: product,
    });
  }
}
