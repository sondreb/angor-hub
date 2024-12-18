import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="[
      { label: 'Home', url: '' }
    ]"></app-breadcrumb>

    <div class="container">
      <h1>Welcome to Angor Hub</h1>
      <p>Your central place for project management and collaboration.</p>
    </div>
  `,
})
export class HomeComponent {}
