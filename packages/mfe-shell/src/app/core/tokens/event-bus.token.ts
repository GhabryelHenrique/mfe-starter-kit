// event-bus.token.ts — Registra o EventBusService no DI do Angular.
//
// WHY providedIn: 'root' + factory?
// Cria o EventBusService uma única vez para toda a aplicação.
// Como @angular/core é shared (singleton: true no federation.config.js),
// o root injector do Angular é compartilhado entre shell e todos os remotes.
// Todos que injetam EVENT_BUS recebem a MESMA instância do Subject<MfeEvent>.
//
// WHY EventBusService.getInstance() e não new EventBusService()?
// getInstance() garante o singleton de módulo JS. Se @org/contracts for
// carregado uma vez pelo browser (garantido pelo shared config), _instance
// é a mesma variável em todos os MFEs — logo, o mesmo Subject.
// Ver: packages/mfe-contracts/src/lib/event-bus.service.ts

import { InjectionToken } from '@angular/core';
import { EventBusService } from '@org/contracts';

export const EVENT_BUS = new InjectionToken<EventBusService>('EVENT_BUS', {
  providedIn: 'root',
  factory: () => EventBusService.getInstance(),
});
