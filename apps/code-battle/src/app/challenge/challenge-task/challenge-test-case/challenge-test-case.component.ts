import { Component, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'code-challenge-test-case',
  templateUrl: './challenge-test-case.component.html',
  styles: [
    `
      .test-case {
        font-size: 14px;
        line-height: 0.4;
      }
    `,
  ],
  animations: [
    trigger('testResult', [
      state(
        'passed',
        style({
          opacity: 1,
          color: '#5cb85c',
        })
      ),
      state(
        'failed',
        style({
          opacity: 1,
          color: '#d9534f',
        })
      ),
      state(
        'waiting',
        style({
          opacity: 0.8,
          color: 'black',
        })
      ),
      transition('* => passed', [animate('0.7s')]),
      transition('* => failed', [animate('0.7s')]),
      transition('passed <=> failed', [animate('0.5s')]),
    ]),
  ],
})
export class ChallengeTestCaseComponent {
  @Input() public testCase?: string;
  @Input() public isPassed = 'waiting';
}
