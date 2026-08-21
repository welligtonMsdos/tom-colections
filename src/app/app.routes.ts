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
    path:'k7',
    loadComponent: () => import('./components/K7/k7/k7').then(m => m.K7),
    canActivate: [authGuard]
  },
  {
    path:'user',
    loadComponent: () => import('./components/user/user').then(m => m.User),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile').then(m => m.Profile),
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
