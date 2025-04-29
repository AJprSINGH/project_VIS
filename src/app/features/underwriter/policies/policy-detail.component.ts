import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InsuranceService } from '../../../core/services/insurance.service';
import { VehicleInsurance } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-policy-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="header-actions">
        <h1>Insurance Policy Details</h1>
        <a routerLink="/underwriter/policies" class="btn btn-outline">Back to List</a>
      </div>
      
      @if (policy) {
        <div class="card detail-card">
          <div class="detail-header">
            <div>
              <h2>{{ policy.customerName }}</h2>
              <p class="subtitle">
                Policy ID: <strong>{{ policy.id }}</strong>
                <span class="dot-separator"></span>
                Created: <strong>{{ policy.createdAt | date:'mediumDate' }}</strong>
              </p>
            </div>
            <div class="policy-status">
              <span class="badge badge-success">Active</span>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>Customer Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Name</span>
                <span class="detail-value">{{ policy.customerName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Phone Number</span>
                <span class="detail-value">{{ policy.phoneNo }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>Vehicle Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Vehicle Number</span>
                <span class="detail-value">{{ policy.vehicleNo }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Vehicle Type</span>
                <span class="detail-value">{{ policy.vehicleType === 'two-wheeler' ? '2-wheeler' : '4-wheeler' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Engine Number</span>
                <span class="detail-value">{{ policy.engineNo }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Chassis Number</span>
                <span class="detail-value">{{ policy.chassisNo }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>Policy Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Insurance Type</span>
                <span class="detail-value">{{ policy.type }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Premium Amount</span>
                <span class="detail-value">₹{{ policy.premiumAmount }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Policy Start Date</span>
                <span class="detail-value">{{ policy.fromDate | date:'mediumDate' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Policy End Date</span>
                <span class="detail-value">{{ policy.toDate | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-actions">
            <button class="btn btn-outline" (click)="printPolicy()">Print Policy</button>
          </div>
        </div>
      }
      
      @if (insuranceService.isLoading() && !policy) {
        <app-loading-spinner message="Loading policy details..."></app-loading-spinner>
      }
    </div>
  `,
  styles: [`
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
    }
    
    .detail-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }
    
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .detail-header h2 {
      margin-bottom: var(--space-1);
    }
    
    .subtitle {
      color: var(--neutral-600);
    }
    
    .dot-separator {
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: var(--neutral-400);
      margin: 0 var(--space-2);
      vertical-align: middle;
    }
    
    .badge {
      display: inline-block;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .badge-success {
      background-color: var(--success-500);
      color: white;
    }
    
    .detail-section {
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .detail-section:last-of-type {
      border-bottom: none;
    }
    
    .detail-section h3 {
      margin-bottom: var(--space-4);
      color: var(--primary-700);
      font-size: 1.125rem;
    }
    
    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-4);
    }
    
    .detail-item {
      display: flex;
      flex-direction: column;
    }
    
    .detail-label {
      font-size: 0.875rem;
      color: var(--neutral-600);
      margin-bottom: var(--space-1);
    }
    
    .detail-value {
      font-weight: 500;
    }
    
    .detail-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: var(--space-4);
      border-top: 1px solid var(--neutral-200);
    }
    
    @media (max-width: 768px) {
      .header-actions {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
      }
      
      .detail-header {
        flex-direction: column;
        gap: var(--space-3);
      }
    }
  `]
})
export class PolicyDetailComponent implements OnInit {
  policy: VehicleInsurance | null | undefined = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public insuranceService: InsuranceService
  ) {}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPolicy(id);
    } else {
      this.router.navigate(['/underwriter/policies']);
    }
  }
  
  loadPolicy(id: string): void {
    this.insuranceService.getPolicyById(id).subscribe({
      next: (data) => {
        this.policy = data;
      },
      error: () => {
        this.router.navigate(['/underwriter/policies']);
      }
    });
  }
  
  printPolicy(): void {
    window.print();
  }
}