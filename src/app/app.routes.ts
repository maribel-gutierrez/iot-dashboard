import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    children: [
      {
        path: '',
        loadComponent: () => import('@features/auth/login/login').then((m) => m.Login),
      },
    ],
  },
  {
    path: 'dashboard',
    canMatch: [authGuard],
    loadComponent: () => import('@features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  { path: '**', redirectTo: 'login' },
];
