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
  `
})
export class ExploreComponent {}
