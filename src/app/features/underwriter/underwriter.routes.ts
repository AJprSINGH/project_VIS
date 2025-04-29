import { Routes } from '@angular/router';

export const UNDERWRITER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/underwriter-dashboard.component').then(m => m.UnderwriterDashboardComponent)
  },
  {
    path: 'policies',
    loadComponent: () => import('./policies/policy-list.component').then(m => m.PolicyListComponent)
  },
  {
    path: 'policies/new',
    loadComponent: () => import('./policies/policy-form.component').then(m => m.PolicyFormComponent)
  },
  {
    path: 'policies/:id',
    loadComponent: () => import('./policies/policy-detail.component').then(m => m.PolicyDetailComponent)
  }
];