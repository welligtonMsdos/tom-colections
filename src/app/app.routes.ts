import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./components/home/home').then(m => m.Home)
  },
  {
    path: 'concerts',
    loadComponent: () => import('./components/my-shows/my-shows').then(m => m.MyShows),
    canActivate: [authGuard]
  },
  {
    path: 'vinyl',
    loadComponent: () => import('./components/vinyl/vinyl').then(m => m.Vinyl),
    canActivate: [authGuard]
  },
  {
    path:'user',
    loadComponent: () => import('./components/user/user').then(m => m.User),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth').then(m => m.Auth)
  }
];
