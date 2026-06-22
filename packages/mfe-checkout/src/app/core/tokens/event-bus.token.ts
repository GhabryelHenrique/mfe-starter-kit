// event-bus.token.ts — Mesmo padrão do shell.
// Ver mfe-shell/src/app/core/tokens/event-bus.token.ts para comentários detalhados.
//
// ANTI-PADRÃO evitado: NÃO importe EventBusService de mfe-shell ou de mfe-products.
// Ambos os remotes dependem APENAS de @org/contracts. Isso é o que cria
// o desacoplamento real — cada MFE poderia ser deployado em produção independente.

import { InjectionToken } from '@angular/core';
import { EventBusService } from '@org/contracts';

export const EVENT_BUS = new InjectionToken<EventBusService>('EVENT_BUS', {
  providedIn: 'root',
  factory: () => EventBusService.getInstance(),
});
