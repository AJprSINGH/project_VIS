import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-container" [class.overlay]="overlay">
      <div class="spinner" [style.width.px]="size" [style.height.px]="size"></div>
      @if (message) {
        <p class="message">{{ message }}</p>
      }
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-4);
    }
    
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 9999;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 3px solid rgba(2, 132, 199, 0.2);
      border-top-color: var(--primary-600);
      animation: spin 1s infinite linear;
    }
    
    .message {
      margin-top: var(--space-3);
      color: var(--neutral-700);
      font-size: 0.875rem;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() size = 40;
  @Input() overlay = false;
  @Input() message = '';
}