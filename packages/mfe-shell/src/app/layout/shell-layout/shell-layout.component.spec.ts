import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { ShellLayoutComponent } from './shell-layout.component';
import { EVENT_BUS } from '../../core/tokens/event-bus.token';

describe('ShellLayoutComponent', () => {
  beforeEach(async () => {
    const mockBus = {
      on: () => new Subject().asObservable(),
      emit: vi.fn(),
      events$: new Subject().asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [ShellLayoutComponent],
      providers: [
        provideRouter([]),
        { provide: EVENT_BUS, useValue: mockBus },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ShellLayoutComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render app-header', () => {
    const fixture = TestBed.createComponent(ShellLayoutComponent);
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('app-header'));
    expect(header).toBeTruthy();
  });

  it('should render app-footer', () => {
    const fixture = TestBed.createComponent(ShellLayoutComponent);
    fixture.detectChanges();
    const footer = fixture.debugElement.query(By.css('app-footer'));
    expect(footer).toBeTruthy();
  });

  it('should render main.shell-content', () => {
    const fixture = TestBed.createComponent(ShellLayoutComponent);
    fixture.detectChanges();
    const main = fixture.debugElement.query(By.css('main.shell-content'));
    expect(main).toBeTruthy();
  });

  it('should render router-outlet inside main', () => {
    const fixture = TestBed.createComponent(ShellLayoutComponent);
    fixture.detectChanges();
    const outlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(outlet).toBeTruthy();
  });
});
