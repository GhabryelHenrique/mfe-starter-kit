// event-bus.token.ts — Mesmo padrão do shell.
// Ver mfe-shell/src/app/core/tokens/event-bus.token.ts para comentários detalhados.
//
// IMPORTANTE: factory chama getInstance(), não `new EventBusService()`.
// Isso garante o singleton de módulo JS quando @org/contracts é shared.

import { InjectionToken } from '@angular/core';
import { EventBusService } from '@org/contracts';

export const EVENT_BUS = new InjectionToken<EventBusService>('EVENT_BUS', {
  providedIn: 'root',
  factory: () => EventBusService.getInstance(),
});
