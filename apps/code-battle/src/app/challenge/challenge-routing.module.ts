import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChallengeComponent } from './challenge.component';

const routes: Routes = [
  {
    path: ':id',
    component: ChallengeComponent,
    // TODO Add Guards
    // canActivate: [ChallengeGuard, AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ChallengeRoutingModule {}
