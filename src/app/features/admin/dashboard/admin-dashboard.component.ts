import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UnderwriterService } from '../../../core/services/underwriter.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <h1 class="page-title">Admin Dashboard</h1>
      
      <div class="dashboard">
        <div class="card dashboard-card">
          <h2>Underwriter Management</h2>
          <p>Manage system underwriters, including registration, search, and password updates.</p>
          <a routerLink="/admin/underwriters" class="btn btn-primary">Manage Underwriters</a>
        </div>
        
        <div class="card dashboard-card">
          <h2>System Overview</h2>
          <div class="stats">
            <div class="stat-item">
              <span class="stat-value">{{ underwriterCount }}</span>
              <span class="stat-label">Underwriters</span>
            </div>
          </div>
        </div>
      </div>
      
      <ng-container *ngIf="underwriterService.isLoading()">
        <app-loading-spinner message="Loading dashboard data..."></app-loading-spinner>
      </ng-container>
    </div>
  `,
  styles: [`
    .page-title {
      margin-bottom: var(--space-6);
    }
    
    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .dashboard-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .dashboard-card h2 {
      color: var(--primary-700);
      margin-bottom: var(--space-3);
    }
    
    .dashboard-card p {
      margin-bottom: var(--space-4);
      color: var(--neutral-600);
      flex-grow: 1;
    }
    
    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-4);
      margin-top: var(--space-4);
    }
    
    .stat-item {
      background-color: var(--primary-50);
      padding: var(--space-3);
      border-radius: var(--radius-md);
      text-align: center;
      min-width: 120px;
    }
    
    .stat-value {
      display: block;
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--primary-700);
    }
    
    .stat-label {
      display: block;
      font-size: 0.875rem;
      color: var(--neutral-600);
      margin-top: var(--space-1);
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  underwriterCount = 0;

  constructor(public underwriterService: UnderwriterService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.underwriterService.getAllUnderwriters().subscribe(underwriters => {
      this.underwriterCount = underwriters.length;
    });
  }
}