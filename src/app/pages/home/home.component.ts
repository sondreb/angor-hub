import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="[{ label: 'Home', url: '' }]"></app-breadcrumb>

    <section class="hero home-hero">
      <div class="hero-wrapper">
        <div class="hero-content">
          <h1>Welcome to Angor Hub</h1>
          <p class="hero-description">
            Your central place for discovering and investing in Bitcoin projects. 
            Join a community of innovators and investors shaping the future of finance.
          </p>
          <a routerLink="/explore" class="cta-button">
            Explore All Projects
            <span class="arrow">→</span>
          </a>
        </div>
      </div>
    </section>

    <div class="features">
      <div class="feature-card">
        <img src="/assets/images/discover.svg" alt="Discover Projects" class="feature-icon">
        <h2>Discover Projects</h2>
        <p>Find innovative Bitcoin projects that align with your interests and investment goals.</p>
      </div>
      <div class="feature-card">
        <img src="/assets/images/invest.svg" alt="Invest Securely" class="feature-icon">
        <h2>Invest Securely</h2>
        <p>Invest in projects with confidence using our secure and transparent platform.</p>
      </div>
      <div class="feature-card">
        <img src="/assets/images/track.svg" alt="Track Progress" class="feature-icon">
        <h2>Track Progress</h2>
        <p>Monitor your investments and stay updated on project developments.</p>
      </div>
    </div>
  `,
  styles: [`
    .home-hero {
      min-height: 60vh;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, var(--header-bg), var(--background));
      text-align: center;
    }

    .hero-content {
      opacity: 0;
      animation: fadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .hero-content h1 {
      font-size: 4.5rem;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      background: linear-gradient(45deg, var(--text), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-description {
      font-size: 1.25rem;
      max-width: 600px;
      margin: 0 auto 2rem;
      opacity: 0.8;
    }

    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
      background: linear-gradient(45deg, var(--accent), var(--accent-dark));
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(8, 108, 129, 0.2);
    }

    .arrow {
      transition: transform 0.3s ease;
    }

    .cta-button:hover .arrow {
      transform: translateX(4px);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      text-align: center;
      padding: 2rem;
      background: var(--background);
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-4px);
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      margin-bottom: 1.5rem;
    }

    .feature-card h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--text);
    }

    .feature-card p {
      color: var(--text);
      opacity: 0.8;
      line-height: 1.6;
    }
  `]
})
export class HomeComponent {}
