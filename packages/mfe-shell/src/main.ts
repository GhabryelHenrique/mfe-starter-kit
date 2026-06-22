// main.ts — Shell entry point.
//
// initFederation() MUST be called BEFORE bootstrapApplication().
// WHY: Native Federation generates an Import Map at build time. At runtime,
// initFederation() fetches the manifest, resolves remote URLs, and injects
// the Import Map into the browser. bootstrapApplication() must run AFTER
// the Import Map is populated — otherwise loadRemoteModule() calls inside
// app.routes.ts cannot resolve remote URLs.
//
// PER-ENVIRONMENT MANIFEST SELECTION:
// environment.ts is swapped via fileReplacements in angular.json:
//   development → src/environments/environment.ts       (federation.manifest.dev.json)
//   staging     → src/environments/environment.staging.ts (federation.manifest.staging.json)
//   production  → src/environments/environment.prod.ts  (federation.manifest.prod.json)

import { initFederation } from '@angular-architects/native-federation';
import { environment } from './environments/environment';

initFederation(environment.federationManifest)
  .catch((err) => console.error('[MFE Shell] Federation init failed:', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('[MFE Shell] Bootstrap failed:', err));
