// main.ts — Ponto de entrada do remote.
// Remotes chamam initFederation() sem argumentos. Ver mfe-products/src/main.ts.

import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch((err) => console.error('[MFE Checkout] Federation init failed:', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('[MFE Checkout] Bootstrap failed:', err));
