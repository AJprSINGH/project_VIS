import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="app-container">
      <app-header *ngIf="authService.isLoggedIn()"></app-header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    main {
      flex: 1;
      padding: var(--space-4) 0;
    }
    
    @media (max-width: 768px) {
      main {
        padding: var(--space-2) 0;
      }
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}