import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <header>
      <nav>
        <a routerLink="/" class="logo-link">
          <img src="images/logo-text.svg" alt="Angor Hub Logo" class="logo">
        </a>
        <div class="nav-links">
          <a routerLink="/explore">Explore</a>
          <!-- <a routerLink="/project">Projects</a> -->
          <button (click)="toggleTheme()" class="theme-toggle">
            {{ (themeService.theme$ | async) === 'light' ? '☀️' : '🌙' }}
          </button>
        </div>
      </nav>
    </header>

    <main>
      <router-outlet />
    </main>

    <footer class="modern-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About</h3>
          <ul>
            <li><a href="/terms">Terms of Use</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Features</h3>
          <ul>
            <li><a href="https://test.angor.io" target="_blank">Angor Testnet</a></li>
            <li><a href="https://angor.io" target="_blank">Angor Homepage</a></li>
            <li><a href="https://mempool.space" target="_blank">Block Explorer</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Connect</h3>
          <div class="social-links">
            <a href="https://x.com/angorprotocol" target="_blank" aria-label="Follow us on X">
              <svg class="social-icon" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://youtube.com/@angorprotocol" target="_blank" aria-label="Subscribe on YouTube">
              <svg class="social-icon" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Angor Hub. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .theme-toggle {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.5rem;
    }

    .modern-footer {
      background: var(--header-bg);
      color: var(--header-text);
      padding: 3rem 1rem 1rem;
      margin-top: 4rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      padding-bottom: 2rem;
    }

    .footer-section h3 {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-section ul li {
      margin-bottom: 0.5rem;
    }

    .footer-section a {
      color: var(--header-text);
      text-decoration: none;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }

    .footer-section a:hover {
      opacity: 1;
      color: var(--accent);
    }

    .footer-section:last-child {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .social-links {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
    }

    .social-icon {
      width: 24px;
      height: 24px;
      fill: currentColor;
      opacity: 0.8;
      transition: all 0.2s ease;
    }

    .social-icon:hover {
      opacity: 1;
      transform: translateY(-2px);
    }

    .footer-bottom {
      border-top: 1px solid var(--border);
      padding-top: 1rem;
      text-align: center;
      opacity: 0.8;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .social-links {
        justify-content: center;
      }
    }
  `]
})
export class AppComponent {
  title = 'angor-hub';

  constructor(public themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
