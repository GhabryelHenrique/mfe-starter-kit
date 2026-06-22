// event-bus.token.ts — Re-exporta EventBusService com JSDoc de uso.
//
// Este arquivo NÃO importa @angular/core porque @org/contracts é
// framework-agnostic. O InjectionToken é criado em cada Angular app.
//
// @example Uso em app.config.ts ou num arquivo core/tokens/event-bus.token.ts:
//
//   import { InjectionToken } from '@angular/core';
//   import { EventBusService } from '@org/contracts';
//
//   export const EVENT_BUS = new InjectionToken<EventBusService>('EVENT_BUS', {
//     providedIn: 'root',
//     factory: () => EventBusService.getInstance(),
//     //                              ^^^^^^^^^^^
//     //  CRÍTICO: getInstance() — não `new EventBusService()`
//     //  O singleton de módulo só funciona se todos chamarem getInstance()
//   });

export { EventBusService } from './event-bus.service';
