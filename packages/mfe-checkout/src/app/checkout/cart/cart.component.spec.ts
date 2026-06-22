import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CartComponent } from './cart.component';
import { CartItem } from '@org/contracts';

const mockItems: CartItem[] = [
  {
    product: { id: '1', name: 'Angular T-Shirt', description: 'Desc', price: 29.99, imageUrl: '', category: 'Apparel', stock: 42 },
    quantity: 2,
  },
  {
    product: { id: '2', name: 'RxJS Mug', description: 'Desc', price: 14.99, imageUrl: '', category: 'Accessories', stock: 18 },
    quantity: 1,
  },
];

describe('CartComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CartComponent);
    fixture.componentRef.setInput('items', []);
    fixture.componentRef.setInput('totalPrice', 0);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show empty state when items is empty', () => {
    const fixture = TestBed.createComponent(CartComponent);
    fixture.componentRef.setInput('items', []);
    fixture.componentRef.setInput('totalPrice', 0);
    fixture.detectChanges();
    const empty = fixture.debugElement.query(By.css('.cart-empty'));
    expect(empty).toBeTruthy();
    expect(empty.nativeElement.textContent).toContain('cart is empty');
  });

  it('should not show cart list when empty', () => {
    const fixture = TestBed.createComponent(CartComponent);
    fixture.componentRef.setInput('items', []);
    fixture.componentRef.setInput('totalPrice', 0);
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('.cart-list'));
    expect(list).toBeNull();
  });

  it('should render one list item per cart item', () => {
    const fixture = TestBed.createComponent(CartComponent);
    fixture.componentRef.setInput('items', mockItems);
    fixture.componentRef.setInput('totalPrice', 74.97);
    fixture.detectChanges();
    const listItems = fixture.debugElement.queryAll(By.css('.cart-item'));
    expect(listItems.length).toBe(2);
  });

  it('should display item names', () => {
    const fixture = TestBed.createComponent(CartComponent);
    fixture.componentRef.setInput('items', mockItems);
    fixture.componentRef.setInput('totalPrice', 74.97);
    fixture.detectChanges();
    const names = fixture.debugElement.queryAll(By.css('.item-name'));
    expect(names[0].nativeElement.textContent.trim()).toBe('Angular T-Shirt');
    expect(names[1].nativeElement.textContent.trim()).toBe('RxJS Mug');
  });

  it('should display item quantities', () => {
    const fixture = TestBed.createComponent(CartComponent);
    fixture.componentRef.setInput('items', mockItems);
    fixture.componentRef.setInput('totalPrice', 74.97);
    fixture.detectChanges();
    const qtys = fixture.debugElement.queryAll(By.css('.item-qty'));
    expect(qtys[0].nativeElement.textContent).toContain('2');
  });

  it('should show total price in footer', () => {
    const fixture = TestBed.createComponent(CartComponent);
    fixture.componentRef.setInput('items', mockItems);
    fixture.componentRef.setInput('totalPrice', 74.97);
    fixture.detectChanges();
    const total = fixture.debugElement.query(By.css('.cart-total'));
    expect(total.nativeElement.textContent).toMatch(/\$\s*74[.,]97/);
  });

  it('should emit clearCart when "Clear" button is clicked', () => {
    const fixture = TestBed.createComponent(CartComponent);
    fixture.componentRef.setInput('items', mockItems);
    fixture.componentRef.setInput('totalPrice', 74.97);
    fixture.detectChanges();

    let clearCount = 0;
    fixture.componentInstance.clearCart.subscribe(() => clearCount++);

    const btn = fixture.debugElement.query(By.css('.btn-clear'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(clearCount).toBe(1);
  });
});
