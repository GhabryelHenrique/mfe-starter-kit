// events.ts — Discriminated union of all cross-MFE events.
//
// WHY discriminated union?
// TypeScript narrows by the literal `type` field. Consumers never need a cast.
// Adding a new event is compile-time safe: any switch/if that doesn't handle
// the new case produces a TS error.

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

// Union of all possible events — expand as new MFEs are added.
export type MfeEvent = ProductSelectedEvent | CartUpdatedEvent | CartClearedEvent;
