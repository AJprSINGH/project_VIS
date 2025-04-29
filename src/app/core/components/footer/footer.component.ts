import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 Star Protect Vehicle Insurance. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      padding: var(--space-4) 0;
      background-color: var(--neutral-800);
      color: var(--neutral-200);
      text-align: center;
      margin-top: auto;
    }
    
    .footer p {
      margin: 0;
      font-size: 0.875rem;
    }
  `]
})
export class FooterComponent {}