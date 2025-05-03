import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule],
    template: `
    <div class="landing-container">
      <nav class="landing-nav">
        <div class="container-new flex justify-between items-center">
          <h1 class="logo">Star Protect Vehicle</h1>
          <a routerLink="/login" class="btn btn-outline">Login</a>
        </div>
      </nav>
      
      <main class="hero-section">
        <div class="container">
          <div class="hero-content slide-up">
            <h1 class="hero-title">Secure Your Journey with Confidence</h1>
            <p class="hero-subtitle">Comprehensive vehicle insurance management made simple and efficient</p>
            <a routerLink="/login" class="btn btn-primary btn-lg pulse">Get Started</a>
          </div>
          
          <div class="features-grid">
            <div class="feature-card fade-in">
              <div class="feature-icon">🛡️</div>
              <h3>Complete Protection</h3>
              <p>Choose between full coverage and third-party insurance options</p>
            </div>
            
            <div class="feature-card fade-in">
              <div class="feature-icon">⚡</div>
              <h3>Quick Processing</h3>
              <p>Efficient policy creation and management system</p>
            </div>
            
            <div class="feature-card fade-in">
              <div class="feature-icon">📱</div>
              <h3>Easy Access</h3>
              <p>Manage policies anytime, anywhere with our digital platform</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .container-new {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 var(--space-4);
    }

    .landing-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
    }
    
    .landing-nav {
      padding: var(--space-4) 0;
      background-color: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-700);
    }
    
    .hero-section {
      padding: calc(var(--space-16) * 2) 0 var(--space-16);
      text-align: center;
    }
    
    .hero-content {
      max-width: 800px;
      margin: 0 auto var(--space-16);
    }
    
    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: var(--space-4);
      background: linear-gradient(135deg, var(--primary-700), var(--primary-500));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--neutral-600);
      margin-bottom: var(--space-8);
    }
    
    .btn-lg {
      padding: var(--space-4) var(--space-8);
      font-size: 1.125rem;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-6);
      margin-top: var(--space-16);
    }
    
    .feature-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      padding: var(--space-6);
      border-radius: var(--radius-lg);
      text-align: center;
      transition: var(--transition-all);
    }
    
    .feature-card:hover {
      transform: translateY(-4px);
    }
    
    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: var(--space-4);
    }
    
    .feature-card h3 {
      color: var(--primary-700);
      margin-bottom: var(--space-2);
    }
    
    .feature-card p {
      color: var(--neutral-600);
    }
    
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .hero-subtitle {
        font-size: 1.125rem;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LandingComponent { }