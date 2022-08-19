import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@code-battle/ui';
import { ChallengeGuard } from './challenge-task/challenge.guard';
import { ChallengeComponent } from './challenge.component';

const routes: Routes = [
  {
    path: ':id',
    component: ChallengeComponent,
    canActivate: [ChallengeGuard, AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ChallengeRoutingModule {}
