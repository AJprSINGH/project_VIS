import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InsuranceService } from '../../../core/services/insurance.service';
import { VehicleInsurance } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-underwriter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  template: `
        <div class="container">
      <h1 class="page-title">Underwriter Dashboard</h1>
      
      <div class="dashboard">
        <div class="card dashboard-card">
          <h2>Vehicle Insurance</h2>
          <p>Create and manage vehicle insurance policies.</p>
          <a routerLink="/underwriter/policies/new" class="btn btn-primary">Create New Policy</a>
        </div>
        
        <div class="card dashboard-card">
          <h2>Recent Policies</h2>
          <ng-container *ngIf="recentPolicies.length === 0 && !insuranceService.isLoading()">
            <p class="empty-message">No policies created yet.</p>
            <a routerLink="/underwriter/policies/new" class="btn btn-primary">Create First Policy</a>
          </ng-container>
          <ng-container *ngIf="recentPolicies.length > 0">
            <ul class="recent-list">
              @for (policy of recentPolicies; track policy.id) {
                <li class="recent-item">
                  <div>
                    <strong>{{ policy.customerName }}</strong>
                    <span class="badge">{{ policy.vehicleType }}</span>
                  </div>
                  <span>{{ policy.createdAt | date:'shortDate' }}</span>
                </li>
}
            </ul>
            <ng-container *ngIf="recentPolicies.length > 0">
              <a routerLink="/underwriter/policies" class="view-all">View All Policies</a>
            </ng-container>
          </ng-container>
        </div>
      </div>
      
      <ng-container *ngIf="insuranceService.isLoading()">
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
    
    .recent-list {
      list-style: none;
      padding: 0;
      margin: 0 0 var(--space-4);
    }
    
    .recent-item {
      padding: var(--space-3);
      border-bottom: 1px solid var(--neutral-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .recent-item:last-child {
      border-bottom: none;
    }
    
    .badge {
      font-size: 0.75rem;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm);
      background-color: var(--primary-100);
      color: var(--primary-700);
      margin-left: var(--space-2);
    }
    
    .view-all {
      display: block;
      text-align: center;
      padding-top: var(--space-3);
      border-top: 1px solid var(--neutral-200);
      color: var(--primary-600);
      font-weight: 500;
    }
    
    .empty-message {
      margin-bottom: var(--space-4);
      color: var(--neutral-500);
    }
  `]
})
export class UnderwriterDashboardComponent implements OnInit {
  recentPolicies: VehicleInsurance[] = [];

  constructor(public insuranceService: InsuranceService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.insuranceService.getAllPolicies().subscribe(policies => {
      // Sort by created date descending and take the most recent 5
      this.recentPolicies = policies
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
        .slice(0, 5);
    });
  }
}