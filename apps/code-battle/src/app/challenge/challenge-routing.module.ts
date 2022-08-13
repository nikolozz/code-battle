import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChallengeTaskComponent } from './challenge-task/challenge-task.component';
import { ChallengeGuard } from './challenge-task/challenge.guard';
import { ChallengeComponent } from './challenge.component';

const routes: Routes = [
  {
    path: '',
    component: ChallengeComponent,
    children: [{
      path: ':id',
      component: ChallengeTaskComponent,
    }],
    canActivate: [ChallengeGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ChallengeRoutingModule { }
