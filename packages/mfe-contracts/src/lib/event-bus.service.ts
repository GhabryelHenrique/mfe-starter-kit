// event-bus.service.ts — Message bus baseado em RxJS Subject.
//
// SINGLETON DE MÓDULO:
// `_instance` é uma variável de módulo. Funciona como singleton global
// SOMENTE quando @org/contracts é carregado UMA vez pelo navegador.
// Para garantir isso, liste @org/contracts no `shared` do federation.config.js
// de TODOS os pacotes Angular com `singleton: true`.
// Veja SHARED_DEPS.md para o raciocínio completo.
//
// WHY Subject e não BehaviorSubject?
// Eventos são fire-and-forget — remotes não devem receber replay do último
// evento ao se inscrever tarde. Para estado que precisa de replay (ex: tema
// global, usuário logado), use BehaviorSubject em um slice separado.
//
// WHY sem @angular/core?
// Esta classe é TypeScript puro. O InjectionToken é criado em cada Angular app
// (veja event-bus.token.ts). Isso mantém @org/contracts publicável sem
// @angular/core como peer dependency — importante para times que eventualmente
// queiram um remote em React ou Vue.

import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MfeEvent } from './events';

let _instance: EventBusService | null = null;

export class EventBusService {
  private readonly _bus$ = new Subject<MfeEvent>();

  private constructor() {}

  static getInstance(): EventBusService {
    if (!_instance) {
      _instance = new EventBusService();
    }
    return _instance;
  }

  /** Emite um evento para todos os assinantes em todos os MFEs. */
  emit(event: MfeEvent): void {
    this._bus$.next(event);
  }

  /** Observable de TODOS os eventos. Prefira `on<K>()` para assinaturas tipadas. */
  get events$(): Observable<MfeEvent> {
    return this._bus$.asObservable();
  }

  /**
   * Assina um tipo específico de evento com narrowing completo de tipo.
   *
   * @example
   * bus.on('CART_UPDATED').subscribe(e => e.payload.items) // e é CartUpdatedEvent
   */
  on<K extends MfeEvent['type']>(
    type: K
  ): Observable<Extract<MfeEvent, { type: K }>> {
    return this._bus$.pipe(
      filter((e): e is Extract<MfeEvent, { type: K }> => e.type === type)
    );
  }
}
