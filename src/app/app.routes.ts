import { Routes } from '@angular/router';
import {AdminLayout} from '@layouts/admin-layout/admin-layout';
import {AUTH_GUARD} from '@shared/guards/auth-guard-guard';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AUTH_GUARD],
    component: AdminLayout,
    children: [
      {
        path: 'events',
        loadComponent: () => import("@pages/event-management/event-management").then(c => c.EventManagement)
      },
      {
        path: 'users',
        loadComponent: () => import("@pages/users/users").then(c => c.Users)
      },
      {
        path: 'roles',
        loadComponent: () => import("@pages/roles/roles").then(c => c.Roles)
      },
      {
        path: '',
        redirectTo: 'events',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    loadComponent: () => import("@pages/landing/landing").then(c => c.Landing)
  },
  {
    path: 'login',
    loadComponent: () => import("@pages/auth/login/login").then(c => c.Login)
  },
  {
    path: '**',
    loadComponent: () => import("@pages/not-found/not-found").then(c => c.NotFound)
  }
];
