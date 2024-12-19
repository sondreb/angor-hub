import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IndexedProject,
  ProjectStats,
  IndexerService,
} from '../../services/indexer.service';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';
import { RelayService } from '../../services/relay.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  template: `
    <app-breadcrumb
      [items]="[
        { label: 'Home', url: '/' },
        { label: 'Explore', url: '/explore' },
        { label: projectId, url: '' }
      ]"
    ></app-breadcrumb>

    <section
      class="hero"
      [ngStyle]="{
        'background-image': project()?.metadata?.banner
          ? 'url(' + project()?.metadata?.banner + ')'
          : 'none'
      }"
    >
      <div class="hero-wrapper">
        <div class="hero-content">
          @if (!project() && indexer.loading()) {
          <div class="loading-spinner">
            <div class="spinner"></div>
          </div>
          }
        </div>
      </div>
    </section>

    <div class="container">
      @if (project()) {
      <div class="project-header">
        @if (project()?.metadata?.['picture']) {
        <img
          [src]="project()?.metadata?.['picture']"
          class="project-logo"
          alt="Project logo"
        />
        }
        <div class="project-title-content">
          <h1>{{ project()?.metadata?.name || projectId }}</h1>
          <p class="project-about">{{ project()?.metadata?.about }}</p>
        </div>
      </div>

      <div class="project-grid">
        <!-- Project Statistics -->
        <section class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ project()?.stats?.investorCount }}</div>
            <div class="stat-label">Total Investors</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ project()?.stats?.amountInvested }}</div>
            <div class="stat-label">Total Invested (sats)</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">
              {{ project()?.stats?.amountSpentSoFarByFounder }}
            </div>
            <div class="stat-label">Amount Spent (sats)</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">
              {{ project()?.stats?.amountInPenalties }}
            </div>
            <div class="stat-label">Penalties Amount (sats)</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">
              {{ project()?.stats?.countInPenalties }}
            </div>
            <div class="stat-label">Penalties Count</div>
          </div>
        </section>

        <!-- Project Details -->
        <section class="project-details">
          <h2>Project Details</h2>
          <div class="info-stack">
            <div class="info-item">
              <label>Project ID</label>
              <span class="ellipsis">{{ project()?.projectIdentifier }}</span>
            </div>
            <div class="info-item">
              <label>Founder Key</label>
              <span class="ellipsis">{{ project()?.founderKey }}</span>
            </div>
            <div class="info-item">
              <label>Recovery Key</label>
              <span class="ellipsis">{{
                project()?.details?.founderRecoveryKey
              }}</span>
            </div>
            <div class="info-item">
              <label>Nostr Public Key</label>
              <span class="ellipsis">{{
                project()?.details?.nostrPubKey
              }}</span>
            </div>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <label>Target Amount</label>
              <span>{{ project()?.details?.targetAmount }} sats</span>
            </div>
            <div class="info-item">
              <label>Penalty Days</label>
              <span>{{ project()?.details?.penaltyDays }} days</span>
            </div>
            <div class="info-item">
              <label>Start Date</label>
              <span>{{ formatDate(project()?.details?.startDate) }}</span>
            </div>
            <div class="info-item">
              <label>Expiry Date</label>
              <span>{{ formatDate(project()?.details?.expiryDate) }}</span>
            </div>
          </div>
        </section>

        <!-- Funding Stages -->
        <section class="funding-stages">
          <h2>Funding Stages</h2>
          <div class="stages-timeline">
            @for (stage of project()?.details?.stages; track $index) {
            <div class="stage-card">
              <div class="stage-number">Stage {{ $index + 1 }}</div>
              <div class="stage-amount">{{ stage.amountToRelease }} sats</div>
              <div class="stage-date">{{ formatDate(stage.releaseDate) }}</div>
            </div>
            }
          </div>
        </section>
      </div>
      }
    </div>
  `,
  styles: [
    `
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
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

      .project-grid {
        display: grid;
        gap: 2rem;
        margin: 2rem 2rem;
      }

      .project-header {
        display: flex;
        align-items: flex-start;
        gap: 2rem;
        margin: 2rem 0;
        padding: 0 1rem;
      }

      .project-logo {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid var(--border);
      }

      .project-title-content {
        flex: 1;
      }

      .project-title-content h1 {
        margin: 0 0 1rem 0;
        font-size: 2rem;
      }

      .project-about {
        margin: 0;
        font-size: 1.1rem;
        color: var(--text);
        opacity: 0.8;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 1rem;
      }

      .info-item {
        background: var(--surface-card);
        padding: 1rem;
        border-radius: 8px;
      }

      .info-item label {
        display: block;
        font-size: 0.9rem;
        color: var(--text-color-secondary);
        margin-bottom: 0.5rem;
      }

      .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .stages-timeline {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      .stage-card {
        background: var(--surface-card);
        padding: 1.5rem;
        border-radius: 8px;
        text-align: center;
      }

      .stage-number {
        font-weight: bold;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
      }

      .stage-amount {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
      }

      .stage-date {
        font-size: 0.9rem;
        color: var(--text-color-secondary);
      }

      .hero {
        height: 200px;
        background-size: cover;
        background-position: center;
        margin-bottom: 2rem;
      }

      .info-stack {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 2rem;
      }

      .info-stack .info-item {
        background: var(--background);
        border: 1px solid var(--border);
        padding: 0.75rem 1rem;
        border-radius: 8px;
      }

      .info-stack .info-item label {
        display: block;
        font-size: 0.8rem;
        color: var(--text);
        opacity: 0.7;
        margin-bottom: 0.25rem;
      }

      .info-stack .info-item span {
        display: block;
        font-family: monospace;
        font-size: 0.9rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ],
})
export class ProjectComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  indexer = inject(IndexerService);
  private relay = inject(RelayService);
  private subscriptions: { unsubscribe: () => void }[] = [];

  project = signal<IndexedProject | null>(null);
  projectId: string = '';

  async ngOnInit() {
    window.scrollTo(0, 0);

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.projectId = id;

    // 1. First try to get from existing projects cache
    let projectData: any = this.indexer.getProject(id);

    try {
      // 2. If not in cache, fetch from Indexer API
      if (!projectData) {
        projectData = await this.indexer.fetchProject(id);
      }

      if (projectData) {
        // Set initial project data
        this.project.set(projectData);

        // Go get the stats data.
        if (!projectData.stats) {
          this.indexer
            .fetchProjectStats(id)
            .then((stats: ProjectStats | null) => {
              projectData.stats = stats;
            });
        }

        if (!projectData.details) {
          // Go fetch data.
          this.relay.fetchData([projectData.nostrEventId]);
          // Go get the details data.
        }

        // if (!projectData.metadata) {
        //   // Go fetch metadata
        //   this.relay.fetchProfile(projectData.details.nostrPubKey);
        // }

        // 3. Subscribe to project updates from relay
        const projectSub = this.relay.projectUpdates.subscribe((details) => {
          // If we get data from relay, make sure the ID is the same then set the details.
          if (details.projectIdentifier == id) {
            projectData.details = details;

            // Go fetch the profile
            this.relay.fetchProfile([details.nostrPubKey]);
          }

          // if (details.projectIdentifier === id) {
          //   this.project.update((current) => {
          //     if (current) {
          //       return { ...current, details };
          //     }
          //     return current;
          //   });
          // }
        });

        // 4. Subscribe to profile updates from relay
        const profileSub = this.relay.profileUpdates.subscribe((update) => {
          if (update.pubkey == projectData.details.nostrPubKey) {
            projectData.metadata = update.profile;
          }

          // if (projectData?.details?.nostrPubKey === update.pubkey) {
          //   this.project.update((current) => {
          //     if (current) {
          //       return { ...current, metadata: update.profile };
          //     }
          //     return current;
          //   });
          // }
        });

        this.subscriptions.push(projectSub, profileSub);

        // 5. Fetch project details from relay
        // if (projectData.nostrEventId) {
        //   await this.relay.fetchData([projectData.nostrEventId]);
        // }
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];

    // Clear signals
    this.project.set(null);
  }

  formatDate(timestamp: number | undefined): string {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
