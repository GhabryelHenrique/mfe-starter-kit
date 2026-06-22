// events.ts — Discriminated union de todos os eventos cross-MFE.
//
// WHY discriminated union?
// TypeScript faz narrowing pelo campo `type` literal. Consumidores nunca
// precisam de cast. Adicionar um novo evento é seguro em tempo de compilação:
// qualquer switch/if que não tratar o novo case causa erro de TS.

import { CartItem } from './models/cart.model';
import { Product } from './models/product.model';

export interface ProductSelectedEvent {
  type: 'PRODUCT_SELECTED';
  payload: Product;
}

export interface CartUpdatedEvent {
  type: 'CART_UPDATED';
  payload: {
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
  };
}

export interface CartClearedEvent {
  type: 'CART_CLEARED';
}

// União de todos os eventos possíveis — expanda conforme novos MFEs forem adicionados.
export type MfeEvent = ProductSelectedEvent | CartUpdatedEvent | CartClearedEvent;
