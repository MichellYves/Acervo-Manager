import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { PlansComponent } from './pages/plans/plans';
import { UsersComponent } from './pages/users/users';
import { LoanComponent } from './pages/loan/loan';
import { Home } from './pages/home/home';
import { LivrosDashboardComponent } from './components/livros-dashboard/livros-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'livros-dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'plans', component: PlansComponent},
  { path: 'users', component: UsersComponent},
  { path: 'loan', component: LoanComponent},
  { path: 'home', component: Home},
  { path: 'livros-dashboard', component: LivrosDashboardComponent },
];