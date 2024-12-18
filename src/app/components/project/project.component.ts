import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IndexedProject,
  ProjectStats,
  IndexerService,
} from '../../services/indexer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1 class="project-title">{{ projectId }}</h1>

      @if (project()) {
      <section class="project-details">
        <p class="hero-description">
          Created on block: {{ project()?.createdOnBlock }}
        </p>
        <p class="hero-description">Founder: {{ project()?.founderKey }}</p>
      </section>
      } @else if (indexer.loading()) {
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      } @else {
      <p class="hero-description">Project details could not be found.</p>
      } @if (project()) {
      <section class="project-stats">
        <h2>Project Statistics</h2>
        @if (loadingStats) {
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        } @else if (stats()) {
        <div class="stats-grid">
          <p>Total Investors: {{ stats()?.investorCount }}</p>
          <p>Total Invested: {{ stats()?.amountInvested }} sats</p>
          <p>Amount Spent: {{ stats()?.amountSpentSoFarByFounder }} sats</p>
          <p>Penalties Amount: {{ stats()?.amountInPenalties }} sats</p>
          <p>Penalties Count: {{ stats()?.countInPenalties }}</p>
        </div>
        }
      </section>
      }
    </div>
  `,
})
export class ProjectComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  indexer = inject(IndexerService);

  project = signal<IndexedProject | null>(null);
  stats = signal<ProjectStats | null>(null);
  projectId: string = '';
  loadingStats = false;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.projectId = id;

    // Try to get from existing projects
    let projectData: IndexedProject | null =
      this.indexer.getProject(id) || null;

    if (!projectData) {
      const fetchedProject = await this.indexer.fetchProject(id);
      projectData = fetchedProject || null;
    }

    if (projectData) {
      this.project.set(projectData);

      // Fetch stats separately with its own loading state
      this.loadingStats = true;
      try {
        const statsData = await this.indexer.fetchProjectStats(id);
        this.stats.set(statsData);
      } finally {
        this.loadingStats = false;
      }
    } else {
      console.error('Project not found:', id);
    }
  }
}
