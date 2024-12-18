import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ExploreComponent } from './components/explore/explore.component';
import { ProjectComponent } from './components/project/project.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'project/:id', component: ProjectComponent },
  { path: '**', redirectTo: '' }
];
