import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '@core/auth/auth.store';

export const authGuard: CanMatchFn = () => {
  const authService = inject(AuthStore);
  return authService.isAuthenticated() ? true : inject(Router).createUrlTree(['/login']);
};
