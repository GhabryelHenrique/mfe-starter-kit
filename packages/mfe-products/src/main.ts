// main.ts — Remote entry point.
//
// Remotes also call initFederation() — but WITHOUT arguments.
// WHY: the manifest argument is only used by the HOST (shell) to resolve
// other remotes. The remote's own remoteEntry is already known by the shell
// because the shell fetched it from the manifest. Passing a manifest here
// would cause the remote to try fetching its own sub-manifest, which is an anti-pattern.

import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch((err) => console.error('[MFE Products] Federation init failed:', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('[MFE Products] Bootstrap failed:', err));
