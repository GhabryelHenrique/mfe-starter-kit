import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { scan, startWith } from 'rxjs/operators';
import { EVENT_BUS } from '../../core/tokens/event-bus.token';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly bus = inject(EVENT_BUS);

  // Badge reativo: ouve CART_UPDATED sem importar nada de mfe-checkout.
  // toSignal() integra o Observable com o sistema de signals do Angular 21.
  readonly cartCount = toSignal(
    this.bus.on('CART_UPDATED').pipe(
      startWith(null),
      scan((_, event) => (event ? event.payload.totalQuantity : 0), 0)
    ),
    { initialValue: 0 }
  );
}
