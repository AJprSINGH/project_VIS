import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'underwriters',
    loadComponent: () => import('./underwriters/underwriter-list.component').then(m => m.UnderwriterListComponent)
  },
  {
    path: 'underwriters/new',
    loadComponent: () => import('./underwriters/underwriter-form.component').then(m => m.UnderwriterFormComponent)
  },
  {
    path: 'underwriters/:id',
    loadComponent: () => import('./underwriters/underwriter-detail.component').then(m => m.UnderwriterDetailComponent)
  }
];