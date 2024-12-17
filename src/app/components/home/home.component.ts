import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="container">
      <h1>Welcome to Angor Hub</h1>
      <p>Your central place for project management and collaboration.</p>
    </div>
  `,
})
export class HomeComponent {}
