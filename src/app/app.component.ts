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

    <footer>
      <p>&copy; 2024 Angor Hub. All rights reserved.</p>
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
  `]
})
export class AppComponent {
  title = 'angor-hub';

  constructor(public themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
