import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsuranceService } from '../../../core/services/insurance.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-policy-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
  <div class="header-actions">
    <h1>Create New Vehicle Insurance</h1>
    <a routerLink="/underwriter/policies" class="btn btn-outline1">Back to List</a>
  </div>

  <div class="card">
    <form [formGroup]="policyForm" (ngSubmit)="onSubmit()">
      <div class="form-grid">
        <div class="form-control">
          <label for="vehicleNo">Vehicle No (Max 10 characters)</label>
          <input 
            type="text" 
            id="vehicleNo" 
            formControlName="vehicleNo"
            placeholder="e.g., MH02AB1234">
          <ng-container *ngIf="submitted && f['vehicleNo'].errors">
            <div class="error-message">
              <ng-container *ngIf="f['vehicleNo'].errors['required']">
                Vehicle number is required
              </ng-container>
              <ng-container *ngIf="f['vehicleNo'].errors['maxlength']">
                Vehicle number cannot exceed 10 characters
              </ng-container>
            </div>
          </ng-container>
        </div>

        <div class="form-control">
          <label for="vehicleType">Vehicle Type</label>
          <select id="vehicleType" formControlName="vehicleType">
            <option value="">Select vehicle type</option>
            <option value="two-wheeler">2-wheeler</option>
            <option value="four-wheeler">4-wheeler</option>
          </select>
          <ng-container *ngIf="submitted && f['vehicleType'].errors">
            <div class="error-message">Vehicle type is required</div>
          </ng-container>
        </div>

        <div class="form-control">
          <label for="customerName">Customer Name</label>
          <input 
            type="text" 
            id="customerName" 
            formControlName="customerName"
            placeholder="Enter customer name">
          <ng-container *ngIf="submitted && f['customerName'].errors">
            <div class="error-message">
              <ng-container *ngIf="f['customerName'].errors['required']">
                Customer name is required
              </ng-container>
              <ng-container *ngIf="f['customerName'].errors['maxlength']">
                Customer name cannot exceed 50 characters
              </ng-container>
              <ng-container *ngIf="true">
                Name should only contain letters 
              </ng-container>
            </div>
          </ng-container>
        </div>

        <div class="form-control">
          <label for="engineNo">Engine No</label>
          <input 
            type="text" 
            id="engineNo" 
            formControlName="engineNo"
            placeholder="Enter engine number">
          <ng-container *ngIf="submitted && f['engineNo'].errors">
            <div class="error-message">Engine number is required</div>
          </ng-container>
        </div>

        <div class="form-control">
          <label for="chassisNo">Chassis No</label>
          <input 
            type="text" 
            id="chassisNo" 
            formControlName="chassisNo"
            placeholder="Enter chassis number">
          <ng-container *ngIf="submitted && f['chassisNo'].errors">
            <div class="error-message">Chassis number is required</div>
          </ng-container>
        </div>

        <div class="form-control">
          <label for="phoneNo">Phone No (10 digits)</label>
          <input 
            type="text" 
            id="phoneNo" 
            formControlName="phoneNo"
            placeholder="Enter 10 digit phone number">
          <ng-container *ngIf="submitted && f['phoneNo'].errors">
            <div class="error-message">
              <ng-container *ngIf="f['phoneNo'].errors['required']">
                Phone number is required
              </ng-container>
              <ng-container *ngIf="true">
                Phone number must be 10 digits and do not start with zero!!
              </ng-container>
            </div>
          </ng-container>
        </div>

        <div class="form-control">
          <label for="premiumAmount">Premium Amount</label>
          <input 
            type="number" 
            id="premiumAmount" 
            formControlName="premiumAmount"
            placeholder="N/A">
          <ng-container *ngIf="submitted && f['premiumAmount'].errors">
            <div class="error-message">
              <ng-container *ngIf="f['premiumAmount'].errors['required']">
                Premium amount is required
              </ng-container>
              <ng-container *ngIf="f['premiumAmount'].errors['min']">
                Premium amount must be greater than 0
              </ng-container>
            </div>
          </ng-container>
        </div>

        <div class="form-control">
          <label for="type">Insurance Type</label>
          <select id="type" formControlName="type">
            <option value="">Select insurance type</option>
            <option value="Full Insurance">Full Insurance</option>
            <option value="Third Party">Third Party</option>
          </select>
          <ng-container *ngIf="submitted && f['type'].errors">
            <div class="error-message">Insurance type is required</div>
          </ng-container>
        </div>

        <div class="form-control">
          <label for="fromDate">From Date</label>
          <input 
            type="date" 
            id="fromDate" 
            formControlName="fromDate">
          <ng-container *ngIf="submitted && f['fromDate'].errors">
            <div class="error-message">From date is required</div>
          </ng-container>
        </div>

        <div class="form-control">
          <label for="toDate">To Date</label>
          <input 
            type="date" 
            id="toDate" 
            formControlName="toDate">
          <ng-container *ngIf="submitted && f['toDate'].errors">
            <div class="error-message">To date is required</div>
          </ng-container>
        </div>
      </div>

      <ng-container *ngIf="error">
        <div class="error-message">{{ error }}</div>
      </ng-container>

      <div class="form-actions">
        <button type="button" class="btn btn-outline" routerLink="/underwriter/policies">Cancel</button>
        <button 
          type="submit" 
          class="btn btn-primary" 
          [disabled]="insuranceService.isLoading()">
          <ng-container *ngIf="insuranceService.isLoading(); else notLoading">
            <span class="spinner-inline"></span>
            Creating...
          </ng-container>
          <ng-template #notLoading>
            Create Policy
          </ng-template>
        </button>
      </div>
    </form>
  </div>
</div>

  `,
  styles: [`
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
    }
    
    .spinner-inline {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      animation: spin 1s infinite linear;
      display: inline-block;
      margin-right: var(--space-2);
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .header-actions {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class PolicyFormComponent implements OnInit {


  policyForm: FormGroup;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    public insuranceService: InsuranceService,
    private authService: AuthService,
    private router: Router
  ) {
    this.policyForm = this.formBuilder.group({
      vehicleNo: ['', [Validators.required, Validators.maxLength(10)]],
      vehicleType: ['', Validators.required],
      customerName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      engineNo: ['', Validators.required],
      chassisNo: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern(/^[1-9]\d{9}$/)]],
      premiumAmount: [null, [Validators.required, Validators.min(1)]],
      type: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });
  }


  private calculateToDate(fromDate: string | null): string | null {
    if (!fromDate) {
      return null;
    }
    const from = new Date(fromDate);
    const to = new Date(from);
    to.setFullYear(from.getFullYear() + 1);
    const year = to.getFullYear();
    const month = (to.getMonth() + 1).toString().padStart(2, '0');
    const day = to.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.policyForm.get('type')?.valueChanges.subscribe(type => {
      if (type === 'Full Insurance') {
        this.policyForm.get('premiumAmount')?.setValue(3000);
      } else if (type === 'Third Party') {
        this.policyForm.get('premiumAmount')?.setValue(5000);
      } else {
        this.policyForm.get('premiumAmount')?.setValue(null);
      }
    });

    this.policyForm.get('fromDate')?.valueChanges.subscribe(fromDate => {
      const toDate = this.calculateToDate(fromDate);
      this.policyForm.get('toDate')?.setValue(toDate, { emitEvent: false });
    });


  }

  get f() { return this.policyForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.policyForm.invalid) {
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.error = 'Authentication error';
      return;
    }

    const policyData = {
      ...this.policyForm.value,
      underwriterId: currentUser.id
    };

    this.insuranceService.createPolicy(policyData).subscribe({
      next: () => {
        this.router.navigate(['/underwriter/policies']);
      },
      error: err => {
        this.error = err.message || 'Failed to create policy';
      }
    });
  }
}