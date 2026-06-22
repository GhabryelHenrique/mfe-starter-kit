import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding: bind route params como @Input() nos componentes
    provideRouter(routes, withComponentInputBinding()),
    // HttpClient com backend fetch (padrão desde Angular 18)
    provideHttpClient(withFetch()),
    // EVENT_BUS é self-providing via factory no token (providedIn: 'root')
    // Não precisa de provide explícito — listado aqui apenas para documentação.
  ],
};
