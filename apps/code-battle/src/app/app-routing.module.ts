import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent, RegisterComponent } from '@code-battle/ui';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'challenge',
    loadChildren: () =>
      import('./challenge/challenge-routing.module').then(
        (m) => m.ChallengeRoutingModule
      ),
  },
  {
    path: 'signup',
    component: RegisterComponent,
  },
  {
    path: 'sign-in',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
