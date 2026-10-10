import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { PlansComponent } from './pages/plans/plans';
import { UsersComponent } from './pages/users/users';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'plans', component: PlansComponent},
  {path: 'users', component: UsersComponent}
];