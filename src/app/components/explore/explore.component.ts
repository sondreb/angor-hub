import { Component } from '@angular/core';

@Component({
  selector: 'app-explore',
  standalone: true,
  template: `
    <section class="hero">
      <div class="hero-wrapper">
        <div class="hero-content">
          <h1>Explore Projects</h1>
          <p class="hero-subtitle">What's your next investment?</p>
          <p class="hero-description">Check out our projects and find your next investment opportunity.</p>
          <button class="primary-button">Get Started</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      padding: 4rem 1rem;
      background-color: #f5f5f5;
      text-align: center;
    }

    .hero-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }

    .hero-content {
      max-width: 600px;
      margin: 0 auto;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .hero-description {
      margin-bottom: 2rem;
    }

    .primary-button {
      padding: 0.75rem 1.5rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .primary-button:hover {
      background-color: #0056b3;
    }
  `]
})
export class ExploreComponent {}
