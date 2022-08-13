import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChallengeComponent } from './challenge.component';
import { ChallengeTaskComponent } from './challenge-task/challenge-task.component';
import { ChallengeTestCaseComponent } from './challenge-task/challenge-test-case/challenge-test-case.component';
import { CdTimerModule } from 'angular-cd-timer';
import { WebsocketModule } from '../websocket/websocket.module';
import { SharedModule } from '../shared/shared.module';
import { CodeEditorModule } from '../code-editor/code-editor.module';
import { ChallengeRoutingModule } from './challenge-routing.module';

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
    WebsocketModule,
    SharedModule,
    CodeEditorModule,
    ChallengeRoutingModule
  ],
})
export class ChallengeModule { }
