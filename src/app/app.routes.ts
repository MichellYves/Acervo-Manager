import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { Planos } from './pages/plans/planos';
import { UsersComponent } from './pages/users/users';
import { LoanComponent } from './pages/loan/loan';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'plans', component: Planos},
  { path: 'users', component: UsersComponent},
  { path: 'loan', component: LoanComponent},
  { path: 'home', component: Home},
];