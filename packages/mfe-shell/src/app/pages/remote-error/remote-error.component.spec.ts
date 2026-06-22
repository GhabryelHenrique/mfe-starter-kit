import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RemoteErrorComponent } from './remote-error.component';

describe('RemoteErrorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoteErrorComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RemoteErrorComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render error heading', () => {
    const fixture = TestBed.createComponent(RemoteErrorComponent);
    fixture.detectChanges();
    const h1 = fixture.debugElement.query(By.css('h1'));
    expect(h1.nativeElement.textContent).toContain('temporariamente indisponível');
  });

  it('should render a link back to home', () => {
    const fixture = TestBed.createComponent(RemoteErrorComponent);
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('a.back-link'));
    expect(link).toBeTruthy();
    expect(link.nativeElement.getAttribute('href')).toBe('/');
  });

  it('should render the warning icon', () => {
    const fixture = TestBed.createComponent(RemoteErrorComponent);
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('.error-icon'));
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.textContent.trim()).toBe('⚠');
  });
});
