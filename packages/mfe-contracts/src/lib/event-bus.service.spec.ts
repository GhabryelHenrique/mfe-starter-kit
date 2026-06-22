import { describe, it, expect, beforeEach } from 'vitest';
import { EventBusService } from './event-bus.service';
import { MfeEvent } from './events';

describe('EventBusService', () => {
  let service: EventBusService;

  beforeEach(() => {
    service = EventBusService.getInstance();
  });

  it('should return a non-null instance', () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(EventBusService);
  });

  it('should return the same instance on multiple calls (singleton)', () => {
    const a = EventBusService.getInstance();
    const b = EventBusService.getInstance();
    expect(a).toBe(b);
  });

  it('should emit events to events$ subscribers', () => {
    const received: MfeEvent[] = [];
    const sub = service.events$.subscribe(e => received.push(e));

    service.emit({ type: 'CART_CLEARED' });

    sub.unsubscribe();
    expect(received).toHaveLength(1);
    expect(received[0].type).toBe('CART_CLEARED');
  });

  it('should emit PRODUCT_SELECTED with payload to events$ subscribers', () => {
    const received: MfeEvent[] = [];
    const sub = service.events$.subscribe(e => received.push(e));

    const product = { id: '1', name: 'Notebook', description: 'desc', price: 3499.99, imageUrl: '', category: 'Electronics', stock: 10 };
    service.emit({ type: 'PRODUCT_SELECTED', payload: product });

    sub.unsubscribe();
    expect(received).toHaveLength(1);
    if (received[0].type === 'PRODUCT_SELECTED') {
      expect(received[0].payload.id).toBe('1');
      expect(received[0].payload.name).toBe('Notebook');
    }
  });

  it('should emit CART_UPDATED with payload to events$ subscribers', () => {
    const received: MfeEvent[] = [];
    const sub = service.events$.subscribe(e => received.push(e));

    service.emit({
      type: 'CART_UPDATED',
      payload: { items: [], totalQuantity: 2, totalPrice: 100 },
    });

    sub.unsubscribe();
    expect(received).toHaveLength(1);
    if (received[0].type === 'CART_UPDATED') {
      expect(received[0].payload.totalQuantity).toBe(2);
    }
  });

  it('on() should only deliver events of the specified type', () => {
    const received: MfeEvent[] = [];
    const sub = service.on('CART_CLEARED').subscribe(e => received.push(e));

    service.emit({ type: 'PRODUCT_SELECTED', payload: { id: '1', name: 'X', description: '', price: 1, imageUrl: '', category: '', stock: 1 } });
    service.emit({ type: 'CART_CLEARED' });

    sub.unsubscribe();
    expect(received).toHaveLength(1);
    expect(received[0].type).toBe('CART_CLEARED');
  });

  it('on("PRODUCT_SELECTED") should deliver typed events with correct payload', () => {
    const received: Array<{ id: string; name: string }> = [];
    const sub = service.on('PRODUCT_SELECTED').subscribe(e => received.push(e.payload));

    service.emit({ type: 'PRODUCT_SELECTED', payload: { id: '42', name: 'Mouse', description: '', price: 99, imageUrl: '', category: '', stock: 5 } });
    service.emit({ type: 'CART_CLEARED' });

    sub.unsubscribe();
    expect(received).toHaveLength(1);
    expect(received[0].id).toBe('42');
    expect(received[0].name).toBe('Mouse');
  });

  it('on("CART_UPDATED") should deliver typed events with correct payload', () => {
    const cartItems = [{ product: { id: '1', name: 'X', description: '', price: 10, imageUrl: '', category: '', stock: 1 }, quantity: 3 }];
    const received: Array<{ totalQuantity: number; totalPrice: number }> = [];
    const sub = service.on('CART_UPDATED').subscribe(e => received.push(e.payload));

    service.emit({ type: 'CART_UPDATED', payload: { items: cartItems, totalQuantity: 3, totalPrice: 30 } });

    sub.unsubscribe();
    expect(received).toHaveLength(1);
    expect(received[0].totalQuantity).toBe(3);
    expect(received[0].totalPrice).toBe(30);
  });

  it('events$ should not replay previous events to late subscribers', () => {
    service.emit({ type: 'CART_CLEARED' });

    const received: MfeEvent[] = [];
    const sub = service.events$.subscribe(e => received.push(e));
    sub.unsubscribe();

    expect(received).toHaveLength(0);
  });
});
