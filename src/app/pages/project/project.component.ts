import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IndexedProject,
  ProjectStats,
  IndexerService,
} from '../../services/indexer.service';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  template: `
    <section class="hero">

    <app-breadcrumb [items]="[
      { label: 'Home', url: '/' },
      { label: 'Explore', url: '/explore' },
      { label: projectId, url: '' }
    ]"></app-breadcrumb>

      <div class="hero-wrapper">
        <div class="hero-content">
          @if (project()) {
            <strong>Project Details</strong>
            <h1 class="hero-subtitle">{{ projectId }}</h1>
            <div class="hero-stats">
              <span class="hero-stat">Created on block: {{ project()?.createdOnBlock }}</span>
              <span class="hero-stat">Founder: {{ project()?.founderKey }}</span>
            </div>
          } @else if (indexer.loading()) {
            <div class="loading-spinner">
              <div class="spinner"></div>
            </div>
          } @else {
            <p class="hero-description">Project details could not be found.</p>
          }
        </div>
      </div>
    </section>

    <div class="container">
      @if (project() && stats()) {
        <section class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ stats()?.investorCount }}</div>
            <div class="stat-label">Total Investors</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats()?.amountInvested }}</div>
            <div class="stat-label">Total Invested (sats)</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats()?.amountSpentSoFarByFounder }}</div>
            <div class="stat-label">Amount Spent (sats)</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats()?.amountInPenalties }}</div>
            <div class="stat-label">Penalties Amount (sats)</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats()?.countInPenalties }}</div>
            <div class="stat-label">Penalties Count</div>
          </div>
        </section>
      } @else if (loadingStats) {
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .hero-stats {
      display: flex;
      gap: 2rem;
      margin-top: 1rem;
    }

    .hero-stat {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .stat-card {
      background: var(--surface-card);
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.8;
    }
  `],
})
export class ProjectComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  indexer = inject(IndexerService);

  project = signal<IndexedProject | null>(null);
  stats = signal<ProjectStats | null>(null);
  projectId: string = '';
  loadingStats = false;

  async ngOnInit() {
    // Scroll to top when component initializes
    window.scrollTo(0, 0);

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

  ngOnDestroy() {
    // Clear signals to prevent stale data
    this.project.set(null);
    this.stats.set(null);
    
    // Reset loading state
    this.loadingStats = false;
  }
}
