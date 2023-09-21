import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerSummaryComponent } from './player-summary.component';

const routes: Routes = [
  // Default route
  {
    path: '',
    component: PlayerSummaryComponent,
    data: { title: 'Player Summary' },
  },
  // Route with id parameter
  {
    path: ':id',
    component: PlayerSummaryComponent,
    data: { title: 'Player Summary' },
  },
  // Any other routes
  { path: '**', redirectTo: 'player-summary' },
];

export const routing: ModuleWithProviders<RouterModule> =
  RouterModule.forChild(routes);
