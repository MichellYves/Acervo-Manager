import { Routes } from '@angular/router';
import { PlansComponent } from './pages/plans/plans';

export const routes: Routes = [
  // Redireciona a página inicial (localhost:4200/) para a rota de planos
  { path: '', redirectTo: 'plans', pathMatch: 'full' },
  { path: 'plans', component: PlansComponent }
];