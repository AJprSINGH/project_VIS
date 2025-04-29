import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InsuranceService } from '../../../core/services/insurance.service';
import { VehicleInsurance } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="header-actions">
        <h1>Insurance Policies</h1>
        <a routerLink="/underwriter/policies/new" class="btn btn-primary">Create New Policy</a>
      </div>
      
      @if (policies.length === 0 && !insuranceService.isLoading()) {
        <div class="empty-state card">
          <h3>No Policies Found</h3>
          <p>You haven't created any insurance policies yet.</p>
          <a routerLink="/underwriter/policies/new" class="btn btn-primary">Create First Policy</a>
        </div>
      } @else {
        <div class="card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Policy ID</th>
                <th>Customer Name</th>
                <th>Vehicle No</th>
                <th>Type</th>
                <th>Premium Amount</th>
                <th>Valid Until</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (policy of policies; track policy.id) {
                <tr>
                  <td>{{ policy.id }}</td>
                  <td>{{ policy.customerName }}</td>
                  <td>{{ policy.vehicleNo }}</td>
                  <td>{{ policy.type }}</td>
                  <td>₹{{ policy.premiumAmount }}</td>
                  <td>{{ policy.toDate | date:'mediumDate' }}</td>
                  <td class="actions">
                    <a [routerLink]="['/underwriter/policies', policy.id]" class="btn-link">View</a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
      
      @if (insuranceService.isLoading()) {
        <app-loading-spinner message="Loading policies..."></app-loading-spinner>
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
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .data-table th,
    .data-table td {
      padding: var(--space-3);
      text-align: left;
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .data-table th {
      font-weight: 600;
      color: var(--neutral-700);
      background-color: var(--neutral-50);
    }
    
    .data-table tr:last-child td {
      border-bottom: none;
    }
    
    .actions {
      display: flex;
      gap: var(--space-2);
    }
    
    .btn-link {
      color: var(--primary-600);
      text-decoration: none;
      font-weight: 500;
    }
    
    .btn-link:hover {
      text-decoration: underline;
    }
    
    .empty-state {
      text-align: center;
      padding: var(--space-8) var(--space-4);
    }
    
    .empty-state h3 {
      margin-bottom: var(--space-2);
    }
    
    .empty-state p {
      margin-bottom: var(--space-6);
      color: var(--neutral-600);
    }
    
    @media (max-width: 768px) {
      .header-actions {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
      }
      
      .data-table {
        display: block;
        overflow-x: auto;
      }
    }
  `]
})
export class PolicyListComponent implements OnInit {
  policies: VehicleInsurance[] = [];
  
  constructor(public insuranceService: InsuranceService) {}
  
  ngOnInit(): void {
    this.loadPolicies();
  }
  
  loadPolicies(): void {
    this.insuranceService.getAllPolicies().subscribe(data => {
      this.policies = data;
    });
  }
}