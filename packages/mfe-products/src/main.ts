// main.ts — Ponto de entrada do remote.
//
// Remotes também chamam initFederation() — mas SEM argumentos.
// WHY: o argumento de manifest só é usado pelo HOST (shell) para resolver
// outros remotes. O próprio remoteEntry do remote já é conhecido pelo shell
// pois o shell o buscou a partir do manifest. Passar um manifest aqui faria
// o remote tentar buscar um sub-manifest próprio, que é um anti-padrão.

import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch((err) => console.error('[MFE Products] Federation init failed:', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('[MFE Products] Bootstrap failed:', err));
