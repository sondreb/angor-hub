import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';
import { BlogService, BlogPost } from '../../services/blog.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent, DatePipe],
  template: `
    <app-breadcrumb [items]="[{ label: 'Home', url: '' }]"></app-breadcrumb>

    <section class="hero home-hero">
      <div class="hero-wrapper">
        <div class="hero-content">
          <h1>Welcome to Angor Hub</h1>
          <p class="hero-description">
            Your central place for discovering and investing in Bitcoin projects. 
            Join a community of innovators and investors shaping the future of finance.
          </p>
          <a routerLink="/explore" class="cta-button">
            Explore All Projects
            <span class="arrow">→</span>
          </a>
        </div>
      </div>
    </section>

    <div class="features">
      <div class="feature-card">
        <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
        <h2>Discover Projects</h2>
        <p>Find innovative Bitcoin projects that align with your interests and investment goals.</p>
      </div>
      <div class="feature-card">
        <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2>Invest Securely</h2>
        <p>Invest in projects with confidence using our secure and transparent platform.</p>
      </div>
      <div class="feature-card">
        <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2>Track Progress</h2>
        <p>Monitor your investments and stay updated on project developments.</p>
      </div>
    </div>

    <section class="blog-section">
      <div class="container">
        <h2 class="section-title">Latest from the Blog</h2>
        
        @if (blogPosts.length > 0) {
          <div class="blog-grid">
            <a [href]="blogPosts[0].link" class="blog-post featured" target="_blank">
              <div class="post-image" [style.background-image]="'url(' + (blogPosts[0].thumbnail || '/assets/images/default-blog.jpg') + ')'">
              </div>
              <div class="post-content">
                <h3>{{blogPosts[0].title}}</h3>
                <p class="post-date">{{blogPosts[0].pubDate | date:'mediumDate'}}</p>
                <p class="post-excerpt">{{blogPosts[0].description}}</p>
              </div>
            </a>
            
            <div class="blog-posts-secondary">
              @for (post of blogPosts.slice(1); track post.link) {
                <a [href]="post.link" class="blog-post" target="_blank">
                  <div class="post-image" [style.background-image]="'url(' + (post.thumbnail || '/assets/images/default-blog.jpg') + ')'">
                  </div>
                  <div class="post-content">
                    <h4>{{post.title}}</h4>
                    <p class="post-date">{{post.pubDate | date:'mediumDate'}}</p>
                  </div>
                </a>
              }
            </div>
          </div>
          <div class="blog-cta">
            <a href="https://blog.angor.io" target="_blank" class="blog-button">
              Explore the Blog
              <span class="arrow">→</span>
            </a>
          </div>
        } @else {
          <div class="loading-spinner">
            <div class="spinner"></div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .home-hero {
      min-height: 60vh;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, var(--header-bg), var(--background));
      text-align: center;
    }

    .hero-content {
      opacity: 0;
      animation: fadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .hero-content h1 {
      font-size: 4.5rem;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      background: linear-gradient(45deg, var(--text), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-description {
      font-size: 1.25rem;
      max-width: 600px;
      margin: 0 auto 2rem;
      opacity: 0.8;
    }

    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
      background: linear-gradient(45deg, var(--accent), var(--accent-dark));
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(8, 108, 129, 0.2);
    }

    .arrow {
      transition: transform 0.3s ease;
    }

    .cta-button:hover .arrow {
      transform: translateX(4px);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      text-align: center;
      padding: 2rem;
      background: var(--background);
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-4px);
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      margin-bottom: 1.5rem;
      color: var(--accent);
    }

    .feature-card h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--text);
    }

    .feature-card p {
      color: var(--text);
      opacity: 0.8;
      line-height: 1.6;
    }

    .blog-section {
      padding: 4rem 2rem;
      background: var(--background);
    }

    .section-title {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 3rem;
      color: var(--text);
    }

    .blog-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .blog-post {
      text-decoration: none;
      color: inherit;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.3s ease;
      background: var(--background);
      border: 1px solid var(--border);
      display: flex;
    }

    .featured.blog-post {
      flex-direction: column;
    }

    .blog-post:hover {
      transform: translateY(-2px);
    }

    .post-image {
      height: 100px;
      min-width: 150px;
      background-size: cover;
      background-position: center;
      background-color: var(--border);
    }

    .featured .post-image {
      height: 250px;
      min-width: 100%;
    }

    .post-content {
      padding: 1rem;
      flex: 1;
    }

    .featured .post-content {
      padding: 1.5rem;
    }

    .post-content h3 {
      font-size: 1.5rem;
      margin: 0 0 0.5rem;
      color: var(--text);
    }

    .post-content h4 {
      font-size: 1rem;
      margin: 0 0 0.25rem;
      color: var(--text);
    }

    .post-date {
      font-size: 0.85rem;
      opacity: 0.7;
      margin: 0;
    }

    .post-excerpt {
      opacity: 0.8;
      line-height: 1.4;
      margin-top: 0.5rem;
    }

    .blog-posts-secondary {
      display: grid;
      gap: 0.75rem;
    }

    .featured {
      grid-row: span 2;
    }

    @media (max-width: 768px) {
      .blog-grid {
        grid-template-columns: 1fr;
      }

      .featured {
        grid-row: auto;
      }

      .blog-post {
        flex-direction: column;
      }

      .post-image {
        height: 150px;
        min-width: 100%;
      }
    }

    .blog-cta {
      text-align: center;
      margin-top: 3rem;
    }

    .blog-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--text);
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .blog-button:hover {
      background: var(--background);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: var(--accent);
      color: var(--accent);
    }

    .blog-button .arrow {
      transition: transform 0.3s ease;
    }

    .blog-button:hover .arrow {
      transform: translateX(4px);
    }
  `]
})
export class HomeComponent implements OnInit {
  private blogService = inject(BlogService);
  blogPosts: BlogPost[] = [];

  async ngOnInit() {
    this.blogPosts = await this.blogService.getLatestPosts();
  }
}
