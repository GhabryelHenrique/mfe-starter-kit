// main.ts — Ponto de entrada do shell.
//
// initFederation() DEVE ser chamado ANTES de bootstrapApplication().
// WHY: Native Federation gera um Import Map em tempo de build. Em runtime,
// initFederation() busca o manifest, resolve as URLs dos remotes e injeta
// o Import Map no browser. bootstrapApplication() precisa rodar DEPOIS que
// o Import Map estiver populado, caso contrário loadRemoteModule() dentro
// de app.routes.ts não consegue resolver as URLs dos remotes.
//
// SELEÇÃO DE MANIFEST POR AMBIENTE:
// O arquivo environment.ts é trocado via fileReplacements no angular.json:
//   development → src/environments/environment.ts       (federation.manifest.dev.json)
//   staging     → src/environments/environment.staging.ts (federation.manifest.staging.json)
//   production  → src/environments/environment.prod.ts  (federation.manifest.prod.json)

import { initFederation } from '@angular-architects/native-federation';
import { environment } from './environments/environment';

initFederation(environment.federationManifest)
  .catch((err) => console.error('[MFE Shell] Federation init failed:', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('[MFE Shell] Bootstrap failed:', err));
