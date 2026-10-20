import { Routes } from '@angular/router';
import { PlansComponent } from './pages/plans/plans';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
  // Redireciona a página inicial (localhost:4200/) para a rota de planos
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }
];