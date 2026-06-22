// main.ts — Remote entry point.
// Remotes call initFederation() without arguments. See mfe-products/src/main.ts.

import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch((err) => console.error('[MFE Checkout] Federation init failed:', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('[MFE Checkout] Bootstrap failed:', err));
