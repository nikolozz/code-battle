import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UiModule } from '@code-battle/ui';
import { CdTimerModule } from 'angular-cd-timer';
import { ChallengeRoutingModule } from './challenge-routing.module';
import { WebsocketModule } from '../websocket/websocket.module';

import { ChallengeComponent } from './challenge.component';
import { ChallengeTaskComponent } from './challenge-task/challenge-task.component';
import { ChallengeTestCaseComponent } from './challenge-task/challenge-test-case/challenge-test-case.component';

@NgModule({
  declarations: [
    ChallengeComponent,
    ChallengeTaskComponent,
    ChallengeTestCaseComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CdTimerModule,
    ChallengeRoutingModule,
    UiModule,
    WebsocketModule,
  ],
})
export class ChallengeModule {}
