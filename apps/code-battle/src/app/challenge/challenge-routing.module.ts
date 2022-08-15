import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { ChallengeGuard } from './challenge-task/challenge.guard';
import { ChallengeComponent } from './challenge.component';

const routes: Routes = [
  {
    path: ':id',
    component: ChallengeComponent,
    // canActivate: [ChallengeGuard], // AuthGuard, ChallengeGuard 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ChallengeRoutingModule {}
