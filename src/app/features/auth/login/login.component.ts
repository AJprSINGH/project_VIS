import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="login-container">
      <div class="login-card slide-up">
        <div class="login-header">
          <h1>Star Protect Vehicle</h1>
          <p>Insurance Management System</p>
        </div>
        
        <div class="login-tabs">
          <button 
            [class.active]="loginType === 'admin'"
            (click)="setLoginType('admin')">Admin Login</button>
          <button 
            [class.active]="loginType === 'underwriter'"
            (click)="setLoginType('underwriter')">Underwriter Login</button>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-control">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username"
              placeholder="Enter your username"
              autocomplete="username">
            @if (submitted && f['username'].errors) {
              <div class="error-message">Username is required</div>
            }
          </div>
          
          <div class="form-control">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              placeholder="Enter your password"
              autocomplete="current-password">
            @if (submitted && f['password'].errors) {
              <div class="error-message">Password is required</div>
            }
          </div>
          
          @if (error) {
            <div class="error-message form-error">{{ error }}</div>
          }
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary login-btn" 
              [disabled]="authService.isLoading()">
              @if (authService.isLoading()) {
                <span class="spinner-inline"></span>
                Logging in...
              } @else {
                Log In
              }
            </button>
          </div>
          
          @if (loginType === 'admin') {
            <div class="demo-credentials">
              <p>Demo Admin credentials:</p>
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> admin</p>
            </div>
          } @else {
            <div class="demo-credentials">
              <p>Demo Underwriter credentials:</p>
              <p><strong>Username:</strong> underwriter1</p>
              <p><strong>Password:</strong> Pass&#64;123</p>
            </div>
          }
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--primary-700), var(--secondary-600));
      padding: var(--space-4);
    }
    
    .login-card {
      width: 100%;
      max-width: 420px;
      background-color: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }
    
    .login-header {
      text-align: center;
      padding: var(--space-6);
      background-color: var(--primary-50);
    }
    
    .login-header h1 {
      color: var(--primary-700);
      margin-bottom: var(--space-2);
    }
    
    .login-header p {
      color: var(--neutral-600);
      margin: 0;
    }
    
    .login-tabs {
      display: flex;
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .login-tabs button {
      flex: 1;
      padding: var(--space-3);
      background: none;
      border: none;
      font-weight: 500;
      color: var(--neutral-500);
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .login-tabs button.active {
      color: var(--primary-600);
      border-bottom: 2px solid var(--primary-600);
    }
    
    form {
      padding: var(--space-6);
    }
    
    .form-actions {
      margin-top: var(--space-6);
    }
    
    .login-btn {
      width: 100%;
      padding: var(--space-3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
    }
    
    .spinner-inline {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      animation: spin 1s infinite linear;
      display: inline-block;
    }
    
    .form-error {
      margin: var(--space-3) 0;
      padding: var(--space-2);
      background-color: rgba(239, 68, 68, 0.1);
      border-radius: var(--radius-md);
      text-align: center;
    }
    
    .demo-credentials {
      margin-top: var(--space-6);
      padding: var(--space-3);
      background-color: var(--neutral-100);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
    }
    
    .demo-credentials p {
      margin: var(--space-1) 0;
      color: var(--neutral-600);
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  error = '';
  loginType: 'admin' | 'underwriter' = 'admin';
  returnUrl: string;
  
  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
    
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  
  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  
  setLoginType(type: 'admin' | 'underwriter'): void {
    this.loginType = type;
    this.loginForm.reset();
    this.error = '';
  }
  
  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    
    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    
    this.authService.login(
      this.f['username'].value,
      this.f['password'].value
    ).subscribe({
      next: () => this.redirectBasedOnRole(),
      error: err => {
        this.error = err;
      }
    });
  }
  
  private redirectBasedOnRole(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.isUnderwriter()) {
      this.router.navigate(['/underwriter/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}