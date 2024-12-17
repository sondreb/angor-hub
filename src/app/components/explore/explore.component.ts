import { Component, inject } from '@angular/core';
import { RelayService } from '../../services/relay.service';
import { IndexerService } from '../../services/indexer.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  template: `
    <section class="hero">
      <div class="hero-wrapper">
        <div class="hero-content">
          <h1>Explore Projects</h1>
          <p class="hero-subtitle">What's your next investment?</p>
          <p class="hero-description">
            Check out our projects and find your next investment opportunity.
          </p>
          <button class="primary-button">Get Started</button>
        </div>
      </div>
    </section>

    <section class="projects">
      @for (project of indexer.projects(); track project.projectIdentifier) {
        <div class="project-card">
          <h3>{{project.projectIdentifier}}</h3>
          <p>Created on block: {{project.createdOnBlock}}</p>
          <p>Founder: {{project.founderKey}}</p>
        </div>
      }
    </section>
  `,
})
export class ExploreComponent {
  // relay = inject(RelayService);

  indexer = inject(IndexerService);

  async ngOnInit() {
    await this.indexer.fetchProjects();
    console.log(this.indexer);
    // console.log(this.relay);
  }
}
