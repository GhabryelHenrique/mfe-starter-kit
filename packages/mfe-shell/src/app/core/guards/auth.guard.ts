// auth.guard.ts — Guard de autenticação (placeholder).
//
// Em produção, injete seu AuthService aqui e verifique JWT/sessão.
// Este placeholder sempre permite acesso.
//
// Para ativar numa rota em app.routes.ts:
//   canActivate: [authGuard]

import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (_route, _state) => {
  // const authService = inject(AuthService);
  // const router = inject(Router);
  // return authService.isAuthenticated()
  //   ? true
  //   : router.createUrlTree(['/login']);
  return true;
};
