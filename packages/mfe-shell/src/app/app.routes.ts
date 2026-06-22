// app.routes.ts — Configuração de rotas do shell.
//
// loadRemoteModule(remoteName, exposedModule) é a API do Native Federation.
//   `remoteName`     → chave no federation.manifest.*.json
//   `exposedModule`  → chave no `exposes` do federation.config.js do remote
//
// PADRÃO DE ERROR BOUNDARY:
// O .catch() em cada rota de remote captura falhas de carregamento (rede,
// remote offline, incompatibilidade de versão) e redireciona para uma
// página de erro sem derrubar o shell inteiro.
// Para produção: estenda com um ErrorHandler que reporte para Sentry/Datadog.

import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { ShellLayoutComponent } from './layout/shell-layout/shell-layout.component';
import { RemoteErrorComponent } from './pages/remote-error/remote-error.component';

export const routes: Routes = [
  {
    // ShellLayoutComponent fornece header/nav/footer como frame persistente.
    // Todos os remotes são filhos deste componente via o router-outlet interno.
    path: '',
    component: ShellLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
      {
        path: 'products',
        // canActivate: [authGuard],  // descomente para proteger a rota
        loadChildren: () =>
          loadRemoteModule('mfe-products', './Routes')
            .then((m) => m.routes)
            .catch(() => {
              // Remote não carregou — exibe error boundary sem quebrar o shell.
              return [{ path: '**', component: RemoteErrorComponent }];
            }),
      },
      {
        path: 'checkout',
        loadChildren: () =>
          loadRemoteModule('mfe-checkout', './Routes')
            .then((m) => m.routes)
            .catch(() => [{ path: '**', component: RemoteErrorComponent }]),
      },
      {
        path: 'remote-error',
        component: RemoteErrorComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/remote-error',
  },
];
