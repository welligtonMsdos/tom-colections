import { Routes } from '@angular/router';
import { RoleGuard } from './RoleGuard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./components/home/home').then(m => m.Home)
  },
  {
    path: 'concerts',
    loadComponent: () => import('./components/my-shows/my-shows').then(m => m.MyShows),
    canActivate: [RoleGuard],
    data: { role: ['Admin', 'User'] }  
  },  
  {
    path: 'vinyl',
    loadComponent: () => import('./components/vinyl/vinyl').then(m => m.Vinyl),
    canActivate: [RoleGuard],
    data: { role: ['Admin', 'User'] }  
  },
  {
    path:'k7',
    loadComponent: () => import('./components/K7/k7/k7').then(m => m.K7),
    canActivate: [RoleGuard],
    data: { role: ['Admin', 'User'] }  
  },
  {
    path:'user',
    loadComponent: () => import('./components/user/user').then(m => m.User),
    canActivate: [RoleGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile').then(m => m.Profile),
    canActivate: [RoleGuard],
    data: { role: ['Admin', 'User'] }   
  },
  {
    path:'unauthorized',
    loadComponent: () => import('./components/auth/unauthorized/unauthorized').then(m => m.Unauthorized)
  },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth').then(m => m.Auth)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }  
];
