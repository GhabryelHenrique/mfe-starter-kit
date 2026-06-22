import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { HeaderComponent } from './header.component';
import { EVENT_BUS } from '../../core/tokens/event-bus.token';
import { CartUpdatedEvent } from '@org/contracts';

describe('HeaderComponent', () => {
  let cartUpdated$: Subject<CartUpdatedEvent>;

  beforeEach(async () => {
    cartUpdated$ = new Subject<CartUpdatedEvent>();
    const mockBus = {
      on: (type: string) => (type === 'CART_UPDATED' ? cartUpdated$.asObservable() : new Subject().asObservable()),
      emit: vi.fn(),
      events$: new Subject().asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: EVENT_BUS, useValue: mockBus },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start with cartCount of 0', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.cartCount()).toBe(0);
  });

  it('should not show badge when cartCount is 0', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const badge = fixture.debugElement.query(By.css('.badge'));
    expect(badge).toBeNull();
  });

  it('should update cartCount when CART_UPDATED is emitted', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    cartUpdated$.next({
      type: 'CART_UPDATED',
      payload: { items: [], totalQuantity: 3, totalPrice: 100 },
    });
    fixture.detectChanges();

    expect(fixture.componentInstance.cartCount()).toBe(3);
  });

  it('should show badge with correct count after CART_UPDATED', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();

    cartUpdated$.next({
      type: 'CART_UPDATED',
      payload: { items: [], totalQuantity: 5, totalPrice: 250 },
    });
    fixture.detectChanges();

    const badge = fixture.debugElement.query(By.css('.badge'));
    expect(badge).toBeTruthy();
    expect(badge.nativeElement.textContent.trim()).toBe('5');
  });

  it('should render nav links for products and checkout', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('nav a'));
    const hrefs = links.map(l => l.nativeElement.getAttribute('href'));
    expect(hrefs).toContain('/products');
    expect(hrefs).toContain('/checkout');
  });
});
