import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <header>
      <nav>
        <a routerLink="/">Angor Hub</a>
        <div class="nav-links">
          <a routerLink="/explore">Explore</a>
          <a routerLink="/project">Projects</a>
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
})
export class AppComponent {
  title = 'angor-hub';
}
