import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { CheckoutPageComponent } from './checkout-page.component';
import { EVENT_BUS } from '../../core/tokens/event-bus.token';
import { ProductSelectedEvent } from '@org/contracts';

const makeProduct = (id: string, name: string, price: number) => ({
  id,
  name,
  description: 'Desc',
  price,
  imageUrl: '',
  category: 'Test',
  stock: 10,
});

describe('CheckoutPageComponent', () => {
  let productSelected$: Subject<ProductSelectedEvent>;
  let mockEmit: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    productSelected$ = new Subject<ProductSelectedEvent>();
    mockEmit = vi.fn();

    const mockBus = {
      on: (type: string) =>
        type === 'PRODUCT_SELECTED' ? productSelected$.asObservable() : new Subject().asObservable(),
      emit: mockEmit,
      events$: new Subject().asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [CheckoutPageComponent],
      providers: [{ provide: EVENT_BUS, useValue: mockBus }],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start with empty cart', () => {
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.cartItems()).toHaveLength(0);
    expect(fixture.componentInstance.totalPrice()).toBe(0);
    expect(fixture.componentInstance.totalQuantity()).toBe(0);
  });

  it('should render the checkout heading', () => {
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();
    const h1 = fixture.debugElement.query(By.css('h1'));
    expect(h1.nativeElement.textContent.trim()).toBe('Checkout');
  });

  it('should add product to cartItems when PRODUCT_SELECTED is emitted', () => {
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();

    productSelected$.next({ type: 'PRODUCT_SELECTED', payload: makeProduct('1', 'T-Shirt', 29.99) });
    fixture.detectChanges();

    expect(fixture.componentInstance.cartItems()).toHaveLength(1);
    expect(fixture.componentInstance.cartItems()[0].quantity).toBe(1);
  });

  it('should increment quantity when same product is added again', () => {
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();

    const event: ProductSelectedEvent = { type: 'PRODUCT_SELECTED', payload: makeProduct('1', 'T-Shirt', 29.99) };
    productSelected$.next(event);
    productSelected$.next(event);
    fixture.detectChanges();

    const items = fixture.componentInstance.cartItems();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('should recalculate totalPrice after adding products', () => {
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();

    productSelected$.next({ type: 'PRODUCT_SELECTED', payload: makeProduct('1', 'T-Shirt', 29.99) });
    productSelected$.next({ type: 'PRODUCT_SELECTED', payload: makeProduct('1', 'T-Shirt', 29.99) });
    fixture.detectChanges();

    expect(fixture.componentInstance.totalPrice()).toBeCloseTo(59.98, 2);
    expect(fixture.componentInstance.totalQuantity()).toBe(2);
  });

  it('should call bus.emit CART_UPDATED after adding a product', () => {
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();

    productSelected$.next({ type: 'PRODUCT_SELECTED', payload: makeProduct('1', 'T-Shirt', 29.99) });
    fixture.detectChanges();

    const cartUpdatedCalls = mockEmit.mock.calls.filter((c: unknown[]) => (c[0] as { type: string }).type === 'CART_UPDATED');
    expect(cartUpdatedCalls).toHaveLength(1);
    expect(cartUpdatedCalls[0][0].payload.totalQuantity).toBe(1);
  });

  it('should clear cart and emit CART_CLEARED when onClearCart is called', () => {
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();

    productSelected$.next({ type: 'PRODUCT_SELECTED', payload: makeProduct('1', 'T-Shirt', 29.99) });
    fixture.detectChanges();

    fixture.componentInstance.onClearCart();
    fixture.detectChanges();

    expect(fixture.componentInstance.cartItems()).toHaveLength(0);
    expect(fixture.componentInstance.totalPrice()).toBe(0);
    expect(fixture.componentInstance.totalQuantity()).toBe(0);

    const clearedCall = mockEmit.mock.calls.find((c: unknown[]) => (c[0] as { type: string }).type === 'CART_CLEARED');
    expect(clearedCall).toBeTruthy();
  });

  it('should unsubscribe on destroy to avoid memory leaks', () => {
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();
    fixture.destroy();

    // No observable emissions after destroy
    productSelected$.next({ type: 'PRODUCT_SELECTED', payload: makeProduct('2', 'Mug', 14.99) });
    expect(fixture.componentInstance.cartItems()).toHaveLength(0);
  });
});
