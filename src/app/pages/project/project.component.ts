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
import NDK, { NDKUser } from '@nostr-dev-kit/ndk';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  template: `
    <!-- <app-breadcrumb
      [items]="[
        { label: 'Home', url: '/' },
        { label: 'Explore', url: '/explore' },
        { label: projectId, url: '' }
      ]"
    ></app-breadcrumb> -->

    <!-- <section
      class="hero"
    >
    <app-breadcrumb
      [items]="[
        { label: 'Home', url: '/' },
        { label: 'Explore', url: '/explore' },
        { label: projectId, url: '' }
      ]"
    ></app-breadcrumb>

    </section> -->

    <section class="hero">
      <app-breadcrumb
        [items]="[
          { label: 'Home', url: '/' },
          { label: 'Explore', url: '/explore' },
          { label: projectId, url: '' }
        ]"
      ></app-breadcrumb>

      <div
        class="project-details-banner"
        [ngStyle]="{
          'background-image': project()?.metadata?.banner
            ? 'url(' + project()?.metadata?.banner + ')'
            : 'none'
        }"
      ></div>

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
          @if (project()?.details?.nostrPubKey) { Open in:
          <a
            [href]="'https://primal.net/p/' + user?.npub"
            target="_blank"
            class="primal-link"
          >
            Primal </a
          >,
          <a
            [href]="
              'https://notes.blockcore.net/p/' + user?.npub
            "
            target="_blank"
            class="primal-link"
          >
            Notes
          </a>,
          <a
            [href]="
              'https://njump.me/' + user?.npub
            "
            target="_blank"
            class="primal-link"
          >
          njump
          </a>


          
          }
        </div>
      </div>

      <div class="tabs">
        <button
          *ngFor="let tab of tabs"
          [class.active]="activeTab === tab.id"
          (click)="setActiveTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="tab-content" [ngSwitch]="activeTab">
        <div *ngSwitchCase="'project'">
          <div class="project-grid">
            <!-- Project Statistics -->
            <section class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">
                  {{ project()?.stats?.investorCount }}
                </div>
                <div class="stat-label">Total Investors</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">
                  {{ (project()?.stats?.amountInvested ?? 0) / 100000000 }} BTC
                </div>
                <div class="stat-label">Total Invested</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">
                  {{ (project()?.stats?.amountSpentSoFarByFounder ?? 0) / 100000000 }} BTC
                </div>
                <div class="stat-label">Amount Spent</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">
                  {{ (project()?.stats?.amountInPenalties ?? 0) / 100000000 }} BTC
                </div>
                <div class="stat-label">Penalties Amount</div>
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
                  <span class="ellipsis">{{
                    project()?.projectIdentifier
                  }}</span>
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
                  <span class="ellipsis">
                    {{ user?.npub }}
                  </span>
                </div>
              </div>
              <div class="info-grid">
                <div class="info-item">
                  <label>Target Amount</label>
                  <span>{{ project()?.details?.targetAmount }} BTC</span>
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
                  <div class="stage-amount">{{ stage.amountToRelease }}%</div>
                  <div class="stage-date">
                    {{ formatDate(stage.releaseDate) }}
                  </div>
                </div>
                }
              </div>
            </section>
          </div>
        </div>

        <div *ngSwitchCase="'faq'" class="faq-tab">
          <h2>Frequently Asked Questions</h2>
          <p>No FAQs available yet.</p>
        </div>

        <div *ngSwitchCase="'updates'" class="updates-tab">
          <h2>Project Updates</h2>
          @if (loading()) {
          <div class="loading">Loading updates...</div>
          } @for (update of updates(); track update.id) {
          <div class="update-card">
            <div class="update-header">
              <span class="update-date">{{
                formatDate(update.created_at)
              }}</span>
            </div>
            <div class="update-content">{{ update.content }}</div>
          </div>
          }
        </div>

        <div *ngSwitchCase="'comments'" class="comments-tab">
          <h2>Comments</h2>
          @if (loading()) {
          <div class="loading">Loading comments...</div>
          } @for (comment of comments(); track comment.id) {
          <div class="comment-card">
            <div class="comment-header">
              <span class="comment-author">{{ comment.pubkey }}</span>
              <span class="comment-date">{{
                formatDate(comment.created_at)
              }}</span>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
          </div>
          }
        </div>
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
        margin-bottom: 1rem;
      }

      .primal-link {
        display: inline-block;
        color: var(--primary-color);
        text-decoration: none;
        font-size: 0.9rem;
      }

      .primal-link:hover {
        text-decoration: underline;
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

      .info-item span {
        font-weight: 700;
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

      .tabs {
        display: flex;
        gap: 1rem;
        margin: 2rem;
        border-bottom: 1px solid var(--border);
        padding-bottom: 0;
      }

      .tabs button {
        background: none;
        border: none;
        padding: 0.75rem 1.5rem;
        cursor: pointer;
        color: var(--text);
        font-size: 1rem;
        position: relative;
        transition: all 0.3s ease;
        opacity: 0.7;
      }

      .tabs button:hover {
        opacity: 1;
        background: var(--background);
      }

      .tabs button.active {
        color: var(--accent);
        opacity: 1;
      }

      .tabs button.active::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--accent);
        border-radius: 2px 2px 0 0;
      }

      .update-card,
      .comment-card {
        background: var(--surface-card);
        padding: 2rem;
        margin-bottom: 1.5rem;
        border-radius: 12px;
        border: 1px solid var(--border);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .update-card:hover,
      .comment-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .update-header,
      .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border);
      }

      .update-date,
      .comment-date {
        font-size: 0.9rem;
        color: var(--text-color-secondary);
      }

      .comment-author {
        font-weight: 600;
        color: var(--primary-color);
      }

      .update-content,
      .comment-content {
        font-size: 1.1rem;
        line-height: 1.6;
        color: var(--text);
        white-space: pre-wrap;
      }

      .loading {
        text-align: center;
        padding: 2rem;
        color: var(--text-color-secondary);
      }

      .project-details-banner {
        min-height: 170px;
        width: 100%;
        background-size: cover;
        background-position: center;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 12px;
      }

      .faq-tab,
      .updates-tab,
      .comments-tab {
        margin: 2rem;
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

  tabs = [
    { id: 'project', label: 'Project' },
    { id: 'faq', label: 'FAQ' },
    { id: 'updates', label: 'Updates' },
    { id: 'comments', label: 'Comments' },
  ];
  activeTab = 'project';
  updates = signal<any[]>([]);
  comments = signal<any[]>([]);
  loading = signal<boolean>(false);

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
    if (tabId === 'updates' && this.updates().length === 0) {
      this.fetchUpdates();
    }
    if (tabId === 'comments' && this.comments().length === 0) {
      this.fetchComments();
    }
  }

  async fetchUpdates() {
    if (!this.project()?.details?.nostrPubKey) return;

    this.loading.set(true);
    try {
      const ndk = await this.relay.ensureConnected();
      const filter = {
        kinds: [1],
        authors: [this.project()!.details!.nostrPubKey],
        limit: 50,
      };

      const events = await ndk.fetchEvents(filter);
      this.updates.set(Array.from(events));
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async fetchComments() {
    if (!this.project()?.details?.nostrPubKey) return;

    this.loading.set(true);
    try {
      const ndk = await this.relay.ensureConnected();
      const filter = {
        kinds: [1],
        '#p': [this.project()!.details!.nostrPubKey],
        limit: 50,
      };

      const events = await ndk.fetchEvents(filter);
      this.comments.set(Array.from(events));
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      this.loading.set(false);
    }
  }

  user: NDKUser | undefined;

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
        } else {
          this.user = new NDKUser({
            pubkey: projectData.details.nostrPubKey,
            relayUrls: this.relay.relayUrls,
          });
          console.log('User:', this.user);
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

            // As soon as we have details, make an NDKUser instance
            this.user = new NDKUser({
              pubkey: projectData.details.nostrPubKey,
              relayUrls: this.relay.relayUrls,
            });
            console.log('User:', this.user);

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

  // convertToNpub(pubkey: string | undefined): string {
  //   if (!pubkey) return 'N/A';
  //   try {
  //     return nip19.npubEncode(pubkey);
  //   } catch (error) {
  //     console.error('Error converting to npub:', error);
  //     return pubkey;
  //   }
  // }
}
