import {
  Component,
  inject,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnInit,
  HostListener,
  effect,
} from '@angular/core';
import { RelayService } from '../../services/relay.service';
import { IndexerService } from '../../services/indexer.service';
import { RouterLink } from '@angular/router';
import { ExploreStateService } from '../../services/explore-state.service';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent, CommonModule],
  styles: [
    `
      .truncate {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
      }
      .loading-profile {
        font-style: italic;
        color: #666;
        margin-left: 0.5em;
      }
      .about {
        margin-top: 0.5em;
        font-style: italic;
      }
      .project-details {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      .project-details p {
        margin: 0.25rem 0;
        font-size: 0.9rem;
        color: var(--text-secondary);
      }
    `,
  ], // Remove fade-out animation styles
  template: `
    <app-breadcrumb
      [items]="[
        { label: 'Home', url: '/' },
        { label: 'Explore', url: '' }
      ]"
    ></app-breadcrumb>

    <section class="hero">
      <div class="hero-wrapper">
        <div class="hero-content">
          <strong>Explore Projects</strong>
          <h1 class="hero-subtitle">What's your next investment?</h1>
          <p class="hero-description">
            Check out our projects and find your next investment opportunity.
          </p>
        </div>
      </div>
    </section>

    <div class="container">
      @if (indexer.loading() && !indexer.projects().length) {
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      } @else if (indexer.projects().length === 0) {
      <p class="text-center">No projects found.</p>
      } @else {
      <section class="projects">
        @for (project of indexer.projects(); track project.projectIdentifier;
        let i = $index) {
        <a
          [routerLink]="['/project', project.projectIdentifier]"
          class="project-card"
          [attr.data-index]="i"
        >
          <h3>{{ project.projectIdentifier }}</h3>
          <p>Created on block: {{ project.createdOnBlock }}</p>
          <p>
            Founder: @if (project.metadata?.name) {
            {{ project.metadata?.name }}
            } @else {
            <span class="truncate">{{ project.founderKey }}</span>
            <small class="loading-profile">Loading profile...</small>
            }
          </p>
          @if (project.metadata?.about) {
          <p class="about">{{ project.metadata?.about }}</p>
          } META:
          {{ project.metadata | json }}

          <!-- Add new project details -->
          @if (project.details) {
          <div class="project-details">
            <p>Stages: {{ project.details.stages.length }}</p>
            <p>Start Date: {{ project.details.startDate | date }}</p>
            <p>Expiry Date: {{ project.details.expiryDate | date }}</p>
            <p>Penalty Days: {{ project.details.penaltyDays }}</p>
            <p>
              Target Amount: {{ project.details.targetAmount / 100000000 }} BTC
            </p>
          </div>
          }
        </a>
        }
      </section>

      @if (!indexer.isComplete()) { @if (indexer.loading()) {
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      } @else {
      <div class="load-more">
        <button class="primary-button" (click)="loadMore()">
          Load More Projects
        </button>
      </div>
      }

      <!-- Move trigger after the button -->
      <div #scrollTrigger class="scroll-trigger"></div>
      } }
    </div>
  `,
})
export class ExploreComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollTrigger') scrollTrigger!: ElementRef;
  private observer: IntersectionObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private loadingTimeout: any = null;
  private exploreState = inject(ExploreStateService);
  private router = inject(Router);
  private relay = inject(RelayService);

  indexer = inject(IndexerService);

  constructor() {
    // Optional: Subscribe to project updates if you need to trigger any UI updates
    effect(() => {
      const projects = this.indexer.projects();
      // Handle any side effects when projects update
      console.log('Projects updated:', projects.length);
    });

    // Listen for profile updates
    this.relay.profileUpdates.subscribe((update) => {
      const id = update.pubkey;
      console.log('UPDATE!!!', update);

      console.log(JSON.stringify(this.indexer.projects()));

      // Find the project from this.indexer.projects() that has the ID.
      const project = this.indexer
        .projects()
        .find((p) => p.details?.nostrPubKey === id);

      console.log('Found project: ', project);
      console.log('Project details:', update);

      if (project) {
        project.metadata = update.profile;
      }

      // Update the matching project with new profile data
      this.indexer.projects.update((projects) =>
        projects.map((project) =>
          project.founderKey === update.pubkey
            ? { ...project, metadata: update.profile }
            : project
        )
      );
    });

    // Listen for profile updates
    this.relay.projectUpdates.subscribe((update) => {
      const id = update.projectIdentifier;

      // Find the project from this.indexer.projects() that has the ID.
      const project = this.indexer
        .projects()
        .find((p) => p.projectIdentifier === id);

      console.log('Found project: ', project);
      console.log('Project details:', update);

      if (project) {
        project.details = update;
      }

      // if (project) {
      //   // Update project with latest data
      //   this.indexer.projects.update(projects =>
      //     projects.map(p => p.projectIdentifier === id ? { ...p, metadata: update } : p)
      //   );
      // }

      // console.log('Project update:', update);
      // Update the matching project with new profile data
      // this.indexer.projects.update((projects) =>
      //   projects.map((project) => {
      //     console.log(project);
      //   })
      // );
    });
  }

  async ngOnInit() {
    this.watchForScrollTrigger();

    // Always check if we actually have projects loaded
    if (this.exploreState.hasState && this.indexer.projects().length > 0) {
      this.indexer.restoreOffset(this.exploreState.offset);

      queueMicrotask(() => {
        window.scrollTo({
          top: this.exploreState.lastScrollPosition,
          behavior: 'instant',
        });
      });
    } else {
      // Either no state or no projects loaded - start fresh
      this.exploreState.clearState();
      await this.indexer.fetchProjects();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Save both scroll position and current offset
    this.exploreState.saveState(
      window.scrollY,
      this.indexer.getCurrentOffset()
    );
  }

  ngAfterViewInit() {
    // Watch for DOM changes to detect when scroll trigger is added
    this.watchForScrollTrigger();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    // Optionally clear state when navigating away
    // this.exploreState.clearState();

    // Don't clear state on normal navigation
    // but do clear if we have no projects
    if (this.indexer.projects().length === 0) {
      this.exploreState.clearState();
    }
  }

  private watchForScrollTrigger() {
    console.log('Setting up mutation observer');

    this.mutationObserver = new MutationObserver(() => {
      const triggerElement = document.querySelector('.scroll-trigger');
      if (triggerElement) {
        console.log('Scroll trigger found in DOM');
        this.mutationObserver?.disconnect();
        this.setupIntersectionObserver();
      }
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private setupIntersectionObserver() {
    console.log('Setting up intersection observer');

    if (!this.scrollTrigger) {
      console.warn('ViewChild scroll trigger not initialized');
      return;
    }

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    };
    console.log('Observer options:', options);

    // Cleanup existing observer if any
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        console.log('Intersection entry:', {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          boundingClientRect: entry.boundingClientRect,
          isLoading: this.indexer.loading(),
          isComplete: this.indexer.isComplete(),
        });

        if (entry.isIntersecting) {
          if (this.indexer.loading()) {
            console.log('Skipping load - already loading');
            return;
          }
          if (this.indexer.isComplete()) {
            console.log('Skipping load - all projects loaded');
            return;
          }
          console.log('Triggering load more from intersection');
          this.loadMore();
        }
      });
    }, options);

    console.log('Scroll trigger element:', this.scrollTrigger.nativeElement);
    this.observer.observe(this.scrollTrigger.nativeElement);
    console.log('Observer attached to scroll trigger');
  }

  async loadMore() {
    console.log('LoadMore called:', {
      isLoading: this.indexer.loading(),
      isComplete: this.indexer.isComplete(),
      currentProjectCount: this.indexer.projects().length,
    });

    if (!this.indexer.loading() && !this.indexer.isComplete()) {
      console.log('Executing load more');
      await this.indexer.loadMore();
      console.log(
        'Load more completed, new project count:',
        this.indexer.projects().length
      );
    }
  }
}
