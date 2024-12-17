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
          <p>Explore Projects</p>
          <h1 class="hero-subtitle">What's your next investment?</h1>
          <p class="hero-description">
            Check out our projects and find your next investment opportunity.
          </p>
        </div>
      </div>
    </section>

    <div class="container">
      @if (indexer.loading()) {
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
      } @else if (indexer.projects().length === 0) {
        <p class="text-center">No projects found.</p>
      } @else {
        <section class="projects">
          @for (project of indexer.projects(); track project.projectIdentifier) {
            <div class="project-card">
              <h3>{{project.projectIdentifier}}</h3>
              <p>Created on block: {{project.createdOnBlock}}</p>
              <p>Founder: {{project.founderKey}}</p>
            </div>
          }
        </section>
      }
    </div>
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
