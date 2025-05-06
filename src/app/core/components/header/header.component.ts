import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="container header-container">
        <div class="logo">
          <a routerLink="/">
            <h1>Star Protect Vehicle</h1>
          </a>
        </div>
        <nav class="nav">
          <ul>
            <ng-container *ngIf="authService.isAdmin(); else underwriterLinks">
              <li><a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a></li>
              <li><a routerLink="/admin/underwriters" routerLinkActive="active">Underwriters</a></li>
            </ng-container>

            <ng-template #underwriterLinks>
              <ng-container *ngIf="authService.isUnderwriter()">
                <li><a routerLink="/underwriter/dashboard" routerLinkActive="active">Dashboard</a></li>
                <li><a routerLink="/underwriter/policies" routerLinkActive="active">Policies</a></li>
              </ng-container>
            </ng-template>

            <li>
              <button class="btn btn-outline" (click)="logout()">Logout</button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: white;
      box-shadow: var(--shadow-sm);
      padding: var(--space-4) 0;
    }
    
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo h1 {
      font-size: 1.5rem;
      margin: 0;
      color: var(--primary-700);
    }
    
    .logo a {
      text-decoration: none;
    }
    
    .nav ul {
      display: flex;
      list-style: none;
      gap: var(--space-6);
      align-items: center;
      margin: 0;
      padding: 0;
    }
    
    .nav a {
      color: var(--neutral-700);
      font-weight: 500;
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .nav a:hover, 
    .nav a.active {
      color: var(--primary-700);
    }
    
    @media (max-width: 768px) {
      .header-container {
        flex-direction: column;
        gap: var(--space-4);
      }
      
      .nav ul {
        gap: var(--space-4);
      }
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService) { }

  logout(): void {
    this.authService.logout();
  }
}