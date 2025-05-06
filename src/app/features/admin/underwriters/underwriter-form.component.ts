import { Component, OnInit } from '@angular/core';
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
        <a routerLink="/admin/underwriters" class="btn btn-outline1">Back to List</a>
      </div>
      
      @if (showSuccessMessage) {
        <div class="success-message-container">
        <div class="success-message-popup">
            <div class="success-message">
              {{ successMessage }}
            </div>
        </div>
        </div>
      }
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
                  } @else{
                    Name should only contain letters
                   }
                </div>
              }
            </div>
            
            <div class="form-control">
              <label for="dob">Date of Birth</label>
              <input 
                type="date" 
                id="dob" 
                formControlName="dob" >
              @if (submitted && f['dob'].errors) {
                <div class="error-message">
                
                
                
                @if (f['dob'].errors['required']) {
                  Date of birth is required
                } @else if (f['dob'].errors['underAge']) {
                  User must be 18 years or older
                }</div>
              }
            </div>
            
            <div class="form-control">
              <label for="joiningDate">Joining Date</label>
              <input 
                type="date" 
                id="joiningDate" 
                formControlName="joiningDate">
              
              
              
              @if (submitted && underwriterForm.errors?.['invalidJoiningDate']) {
                <div class="error-message">
                  Joining date should be 18 years after the date of birth
                </div>
              }
              @if (submitted && f['joiningDate'].errors) {
                <div class="error-message">
                </div>
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
    .success-message-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
      z-index: 1000; /* Ensure it's on top */
    }
    .success-message-popup {
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      text-align: center;
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
export class UnderwriterFormComponent implements OnInit {
  
  private underAgeValidator() {
    return (control: any) => {
      if (control.value) {
        const dob = new Date(control.value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
                
                
                
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          return age - 1 < 18 ? { underAge: true } : null;
        } else {
          return age < 18 ? { underAge: true } : null;
        }
      }
      return null;
    };
  }

  private joiningDateValidator() {
    return (group: FormGroup) => {
      const dob = group.controls['dob'].value;
      const joiningDate = group.controls['joiningDate'].value;

      if (dob && joiningDate) {
      
      
      
        const dobDate = new Date(dob);
        const joiningDateDate = new Date(joiningDate);

        const ageAtJoining = joiningDateDate.getFullYear() - dobDate.getFullYear();
        const monthDiff = joiningDateDate.getMonth() - dobDate.getMonth();

        if (ageAtJoining < 18 || (ageAtJoining === 18 && monthDiff < 0) || (ageAtJoining === 18 && monthDiff === 0 && joiningDateDate.getDate() < dobDate.getDate()) ) {
          return { invalidJoiningDate: true };
        }
      }

      return null;
    };
  }
  
  underwriterForm: FormGroup;
  submitted = false;
  error = '';
  successMessage = 'Underwriter registered successfully';
  showSuccessMessage = false;
  
  constructor(
    private formBuilder: FormBuilder,
    public underwriterService: UnderwriterService,
    private authService: AuthService,
    private router: Router
  ) {
    this.underwriterForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      dob: ['', [Validators.required, this.underAgeValidator()]],
      joiningDate: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/.*[!@#$%^&*(),.?":{}|<>].*/)]]},
      { validators: this.joiningDateValidator() });
  }
  
  ngOnInit(): void {

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
        this.showSuccessMessage=true;
        setTimeout(() => {
          this.showSuccessMessage = false;
          this.router.navigate(['/admin/underwriters']);
        }, 3000); // Redirect after 3 seconds
        
      },
      error: err => {
        this.error = err.message || 'Failed to register underwriter';
      }
    });
  }
}