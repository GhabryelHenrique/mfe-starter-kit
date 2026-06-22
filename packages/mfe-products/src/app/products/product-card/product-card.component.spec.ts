import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProductCardComponent } from './product-card.component';
import { Product } from '@org/contracts';

const mockProduct: Product = {
  id: '1',
  name: 'Angular T-Shirt',
  description: 'Official Angular community shirt. 100% cotton.',
  price: 29.99,
  imageUrl: 'https://placehold.co/280x280/dd0031/white?text=Angular',
  category: 'Apparel',
  stock: 42,
};

const outOfStockProduct: Product = { ...mockProduct, id: '2', stock: 0 };

describe('ProductCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', mockProduct);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display product name', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
    const name = fixture.debugElement.query(By.css('.product-name'));
    expect(name.nativeElement.textContent.trim()).toBe('Angular T-Shirt');
  });

  it('should display product category', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
    const category = fixture.debugElement.query(By.css('.product-category'));
    expect(category.nativeElement.textContent.trim()).toBe('Apparel');
  });

  it('should display product price formatted in USD', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
    const price = fixture.debugElement.query(By.css('.product-price'));
    // Currency symbol and value — locale may use '.' or ',' as decimal separator
    expect(price.nativeElement.textContent).toMatch(/\$\s*29[.,]99/);
  });

  it('should display stock count', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
    const stock = fixture.debugElement.query(By.css('.product-stock'));
    expect(stock.nativeElement.textContent).toContain('42');
  });

  it('should render button with "Add to Cart" when in stock', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button.btn-add'));
    expect(btn.nativeElement.textContent.trim()).toContain('Add to Cart');
    expect(btn.nativeElement.disabled).toBe(false);
  });

  it('should render disabled button with "Out of Stock" when out of stock', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', outOfStockProduct);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button.btn-add'));
    expect(btn.nativeElement.textContent.trim()).toContain('Out of Stock');
    expect(btn.nativeElement.disabled).toBe(true);
  });

  it('should emit addToCart output when button clicked', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();

    let emittedProduct: Product | undefined;
    fixture.componentInstance.addToCart.subscribe((p: Product) => { emittedProduct = p; });

    const btn = fixture.debugElement.query(By.css('button.btn-add'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(emittedProduct).toBeDefined();
    expect(emittedProduct!.id).toBe('1');
  });

  it('should have button disabled when product is out of stock (preventing addToCart)', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', outOfStockProduct);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button.btn-add'));
    expect(btn.nativeElement.disabled).toBe(true);
  });
});
