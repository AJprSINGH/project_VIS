import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnderwriterService } from '../../../core/services/underwriter.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-underwriter-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="header-actions">
        <h1>Register New Underwriter</h1>
        <a routerLink="/admin/underwriters" class="btn btn-outline">Back to List</a>
      </div>
      
      <div class="card">
        <form [formGroup]="underwriterForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-control">
              <label for="name">Name (Max 50 characters)</label>
              <input 
                type="text" 
                id="name" 
                formControlName="name"
                placeholder="Enter full name">
              @if (submitted && f['name'].errors) {
                <div class="error-message">
                  @if (f['name'].errors['required']) {
                    Name is required
                  } @else if (f['name'].errors['maxlength']) {
                    Name cannot exceed 50 characters
                  }
                </div>
              }
            </div>
            
            <div class="form-control">
              <label for="dob">Date of Birth</label>
              <input 
                type="date" 
                id="dob" 
                formControlName="dob">
              @if (submitted && f['dob'].errors) {
                <div class="error-message">Date of birth is required</div>
              }
            </div>
            
            <div class="form-control">
              <label for="joiningDate">Joining Date</label>
              <input 
                type="date" 
                id="joiningDate" 
                formControlName="joiningDate">
              @if (submitted && f['joiningDate'].errors) {
                <div class="error-message">Joining date is required</div>
              }
            </div>
            
            <div class="form-control">
              <label for="password">Default Password (Must include a special character)</label>
              <input 
                type="password" 
                id="password" 
                formControlName="password"
                placeholder="Set initial password">
              @if (submitted && f['password'].errors) {
                <div class="error-message">
                  @if (f['password'].errors['required']) {
                    Password is required
                  } @else if (f['password'].errors['pattern']) {
                    Password must include at least one special character
                  }
                </div>
              }
            </div>
          </div>
          
          @if (error) {
            <div class="error-message">{{ error }}</div>
          }
          
          <div class="form-actions">
            <button type="button" class="btn btn-outline" routerLink="/admin/underwriters">Cancel</button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="underwriterService.isLoading()">
              @if (underwriterService.isLoading()) {
                <span class="spinner-inline"></span>
                Registering...
              } @else {
                Register Underwriter
              }
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
export class UnderwriterFormComponent {
  underwriterForm: FormGroup;
  submitted = false;
  error = '';
  
  constructor(
    private formBuilder: FormBuilder,
    public underwriterService: UnderwriterService,
    private authService: AuthService,
    private router: Router
  ) {
    this.underwriterForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      dob: ['', Validators.required],
      joiningDate: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/.*[!@#$%^&*(),.?":{}|<>].*/)]],
    });
  }
  
  get f() { return this.underwriterForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    
    if (this.underwriterForm.invalid) {
      return;
    }
    
    const underwriterData = {
      name: this.f['name'].value,
      dob: this.f['dob'].value,
      joiningDate: this.f['joiningDate'].value,
      password: this.f['password'].value
    };
    
    this.underwriterService.createUnderwriter(underwriterData).subscribe({
      next: (underwriter) => {
        // Register in auth service for demo
        this.authService.addUnderwriter(underwriter.id, underwriterData.password);
        this.router.navigate(['/admin/underwriters']);
      },
      error: err => {
        this.error = err.message || 'Failed to register underwriter';
      }
    });
  }
}