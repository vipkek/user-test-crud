import { Routes } from '@angular/router';

import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'user/:id',
        loadComponent: () =>
          import('./user-edit').then((m) => m.UserEditComponent),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./not-found').then((m) => m.NotFoundComponent),
  },
];
