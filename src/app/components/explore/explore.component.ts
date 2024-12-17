import { Component, inject, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { RelayService } from '../../services/relay.service';
import { IndexerService } from '../../services/indexer.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  template: `
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
          @for (project of indexer.projects(); track project.projectIdentifier; let i = $index) {
            <div class="project-card" [attr.data-index]="i">
              <h3>{{project.projectIdentifier}}</h3>
              <p>Created on block: {{project.createdOnBlock}}</p>
              <p>Founder: {{project.founderKey}}</p>
            </div>
          }
        </section>

        @if (!indexer.isComplete()) {
          @if (indexer.loading()) {
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
        }
      }
    </div>
  `,
})
export class ExploreComponent implements AfterViewInit, OnDestroy {
  @ViewChild('scrollTrigger') scrollTrigger!: ElementRef;
  private observer: IntersectionObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private loadingTimeout: any = null;

  indexer = inject(IndexerService);

  async ngOnInit() {
    await this.indexer.fetchProjects();
    console.log(this.indexer);
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
      subtree: true
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
      threshold: 0.1
    };
    console.log('Observer options:', options);

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        console.log('Intersection entry:', {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          boundingClientRect: entry.boundingClientRect,
          isLoading: this.indexer.loading(),
          isComplete: this.indexer.isComplete()
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
      currentProjectCount: this.indexer.projects().length
    });

    if (!this.indexer.loading() && !this.indexer.isComplete()) {
      console.log('Executing load more');
      await this.indexer.loadMore();
      console.log('Load more completed, new project count:', this.indexer.projects().length);
    }
  }
}
