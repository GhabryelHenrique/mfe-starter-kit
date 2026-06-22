import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CodeBlockComponent } from './code-block.component';

describe('CodeBlockComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeBlockComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CodeBlockComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render code content inside <pre><code>', () => {
    const fixture = TestBed.createComponent(CodeBlockComponent);
    fixture.componentInstance.code = 'const x = 1;';
    fixture.detectChanges();
    const code = fixture.debugElement.query(By.css('pre code'));
    expect(code.nativeElement.textContent).toContain('const x = 1;');
  });

  it('should show filename when provided', () => {
    const fixture = TestBed.createComponent(CodeBlockComponent);
    fixture.componentInstance.filename = 'app.ts';
    fixture.componentInstance.code = '';
    fixture.detectChanges();
    const filename = fixture.debugElement.query(By.css('.code-filename'));
    expect(filename).toBeTruthy();
    expect(filename.nativeElement.textContent.trim()).toBe('app.ts');
  });

  it('should show language label when filename is not provided', () => {
    const fixture = TestBed.createComponent(CodeBlockComponent);
    fixture.componentInstance.language = 'bash';
    fixture.componentInstance.code = '';
    fixture.detectChanges();
    const lang = fixture.debugElement.query(By.css('.code-language'));
    expect(lang).toBeTruthy();
    expect(lang.nativeElement.textContent.trim()).toBe('bash');
  });

  it('should default language to typescript', () => {
    const fixture = TestBed.createComponent(CodeBlockComponent);
    fixture.componentInstance.code = '';
    fixture.detectChanges();
    expect(fixture.componentInstance.language).toBe('typescript');
  });

  it('should show "Copiar" button initially', () => {
    const fixture = TestBed.createComponent(CodeBlockComponent);
    fixture.componentInstance.code = 'test';
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('.copy-btn'));
    expect(btn.nativeElement.textContent.trim()).toBe('Copiar');
  });

  it('should start with copied signal as false', () => {
    const fixture = TestBed.createComponent(CodeBlockComponent);
    fixture.componentInstance.code = 'test';
    expect(fixture.componentInstance.copied()).toBe(false);
  });

  it('should call navigator.clipboard.writeText on copy()', async () => {
    const fixture = TestBed.createComponent(CodeBlockComponent);
    fixture.componentInstance.code = 'const y = 2;';
    fixture.detectChanges();

    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    await fixture.componentInstance.copy();

    expect(writeText).toHaveBeenCalledWith('const y = 2;');
  });

  it('should set copied to true then back to false after copy()', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(CodeBlockComponent);
    fixture.componentInstance.code = 'code';
    fixture.detectChanges();

    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });

    const copyPromise = fixture.componentInstance.copy();
    await copyPromise;
    fixture.detectChanges();

    expect(fixture.componentInstance.copied()).toBe(true);

    vi.advanceTimersByTime(2000);
    fixture.detectChanges();
    expect(fixture.componentInstance.copied()).toBe(false);

    vi.useRealTimers();
  });
});
