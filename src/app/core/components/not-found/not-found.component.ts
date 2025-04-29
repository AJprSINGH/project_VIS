import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container">
      <div class="not-found-container">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <a routerLink="/" class="btn btn-primary">Go Home</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      text-align: center;
      padding: var(--space-8) 0;
      max-width: 600px;
      margin: 0 auto;
    }
    
    h1 {
      font-size: 6rem;
      color: var(--primary-700);
      margin-bottom: var(--space-2);
      line-height: 1;
    }
    
    h2 {
      font-size: 2rem;
      margin-bottom: var(--space-4);
    }
    
    p {
      margin-bottom: var(--space-6);
      color: var(--neutral-600);
    }
  `]
})
export class NotFoundComponent {}