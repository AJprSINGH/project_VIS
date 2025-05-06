import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnderwriterService } from '../../../core/services/underwriter.service';
import { AuthService } from '../../../core/services/auth.service';
import { Underwriter } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-underwriter-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="header-actions">
        <h1>Underwriter Details</h1>
        <a routerLink="/admin/underwriters" class="btn btn-outline1">Back to List</a>
      </div>
      
      @if (underwriter) {
        <div class="card detail-card">
          <div class="detail-section">
            <h2>Underwriter Information</h2>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">ID</span>
                <span class="detail-value">{{ underwriter.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Name</span>
                <span class="detail-value">{{ underwriter.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Date of Birth</span>
                <span class="detail-value">{{ underwriter.dob | date:'mediumDate' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Joining Date</span>
                <span class="detail-value">{{ underwriter.joiningDate | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h2>Update Password</h2>
            <form [formGroup]="passwordForm" (ngSubmit)="updatePassword()">
              <div class="form-control">
                <label for="newPassword">New Password (Must include a special character)</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  formControlName="newPassword"
                  placeholder="Enter new password"
                  required>
                @if (f['newPassword'].invalid && (f['newPassword'].touched || submitted)) {
                  <div class="error-message">
                    @if (f['newPassword'].errors?.['required']) {
                      Password is required
                    } @else if (f['newPassword'].errors?.['pattern']) {
                      Password must include at least one special character
                    }
                  </div>
                }
              </div>
              
              @if (error) {
                <div class="error-message">{{ error }}</div>
              }
              
              @if (successMessage) {
                <div class="success-message">{{ successMessage }}</div>
              }
              
              <div class="form-actions">
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  [disabled]="passwordForm.invalid || underwriterService.isLoading()">
                  @if (underwriterService.isLoading()) {
                    <span class="spinner-inline"></span>
                    Updating...
                  } @else {
                    Update Password
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }
      
      @if (underwriterService.isLoading() && !underwriter) {
        <app-loading-spinner message="Loading underwriter details..."></app-loading-spinner>
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
    .detail-section {
      border-bottom: 1px solid var(--neutral-200);
      padding-bottom: var(--space-6);
    }
    .detail-section:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .detail-section h2 {
      margin-bottom: var(--space-4);
      color: var(--primary-700);
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
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: var(--space-4);
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
    }
  `]
})
export class UnderwriterDetailComponent implements OnInit {
  underwriter: Underwriter | undefined | null = null;
  passwordForm: FormGroup;
  submitted = false;
  error = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public underwriterService: UnderwriterService,
    private authService: AuthService
  ) {
    this.passwordForm = this.formBuilder.group({
      newPassword: ['', [
        Validators.required,
        Validators.pattern(/.*[!@#$%^&*(),.?":{}|<>].*/),
      ]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUnderwriter(id);
    } else {
      this.router.navigate(['/admin/underwriters']);
    }
  }

  get f() { return this.passwordForm.controls; }

  loadUnderwriter(id: string): void {
    this.underwriterService.getUnderwriterById(id).subscribe({
      next: (data) => {
        this.underwriter = data;
      },
      error: () => {
        this.router.navigate(['/admin/underwriters']);
      }
    });
  }

  updatePassword(): void {
    this.submitted = true;
    this.error = '';
    this.successMessage = '';

    // Mark all controls as touched to show validation errors
    Object.values(this.passwordForm.controls).forEach(control => control.markAsTouched());

    if (this.passwordForm.invalid || !this.underwriter) {
      return;
    }

    const newPassword = this.f['newPassword'].value;

    const success = this.authService.updateUnderwriterPassword(this.underwriter.id, newPassword);

    if (success) {
      this.underwriterService.updateUnderwriter(this.underwriter.id, {
        password: newPassword
      }).subscribe({
        next: () => {
          this.successMessage = 'Password updated successfully';
          this.passwordForm.reset();
          this.submitted = false;
        },
        error: err => {
          this.error = err.message || 'Failed to update password';
        }
      });
    } else {
      this.error = 'Failed to update password';
    }
  }
}
