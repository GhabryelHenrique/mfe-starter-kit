import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProductsListComponent } from './products-list.component';
import { EVENT_BUS } from '../../core/tokens/event-bus.token';
import { MOCK_PRODUCTS } from '../products.mock';

describe('ProductsListComponent', () => {
  let mockEmit: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    mockEmit = vi.fn();
    const mockBus = {
      emit: mockEmit,
      on: vi.fn(),
      events$: { subscribe: vi.fn() },
    };

    await TestBed.configureTestingModule({
      imports: [ProductsListComponent],
      providers: [{ provide: EVENT_BUS, useValue: mockBus }],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProductsListComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a product card for each mock product', () => {
    const fixture = TestBed.createComponent(ProductsListComponent);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('app-product-card'));
    expect(cards.length).toBe(MOCK_PRODUCTS.length);
  });

  it('should render the section heading', () => {
    const fixture = TestBed.createComponent(ProductsListComponent);
    fixture.detectChanges();
    const h1 = fixture.debugElement.query(By.css('h1'));
    expect(h1.nativeElement.textContent.trim()).toContain('Catálogo de Produtos');
  });

  it('should call bus.emit with PRODUCT_SELECTED when addToCart is called', () => {
    const fixture = TestBed.createComponent(ProductsListComponent);
    fixture.detectChanges();

    const product = MOCK_PRODUCTS[0];
    fixture.componentInstance.addToCart(product);

    expect(mockEmit).toHaveBeenCalledOnce();
    expect(mockEmit).toHaveBeenCalledWith({ type: 'PRODUCT_SELECTED', payload: product });
  });

  it('should call addToCart via template event binding when card emits addToCart', () => {
    const fixture = TestBed.createComponent(ProductsListComponent);
    fixture.detectChanges();

    // Trigger the (addToCart) binding on the first product card
    const firstCard = fixture.debugElement.query(By.css('app-product-card'));
    firstCard.triggerEventHandler('addToCart', MOCK_PRODUCTS[0]);
    fixture.detectChanges();

    expect(mockEmit).toHaveBeenCalledWith({ type: 'PRODUCT_SELECTED', payload: MOCK_PRODUCTS[0] });
  });

  it('should emit correct product when different products are added', () => {
    const fixture = TestBed.createComponent(ProductsListComponent);
    fixture.detectChanges();

    fixture.componentInstance.addToCart(MOCK_PRODUCTS[0]);
    fixture.componentInstance.addToCart(MOCK_PRODUCTS[1]);

    expect(mockEmit).toHaveBeenCalledTimes(2);
    expect(mockEmit.mock.calls[0][0]).toEqual({ type: 'PRODUCT_SELECTED', payload: MOCK_PRODUCTS[0] });
    expect(mockEmit.mock.calls[1][0]).toEqual({ type: 'PRODUCT_SELECTED', payload: MOCK_PRODUCTS[1] });
  });
});
