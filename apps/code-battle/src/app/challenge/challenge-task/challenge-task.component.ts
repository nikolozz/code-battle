import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChallengeService } from '../challenge.service';
import { TestCase } from './challenge-test-case/test-case.model';

@Component({
  selector: 'code-challenge-task',
  templateUrl: './challenge-task.component.html',
})
export class ChallengeTaskComponent implements OnInit, OnDestroy {
  public testCases: TestCase[] = [
    { testCase: '2 + 2 should return 4', status: 'waiting' },
    { testCase: '2 + 2 should return 4', status: 'waiting' },
    { testCase: '2 + 2 should return 4', status: 'waiting' },
  ];

  private challengeSubscription?: Subscription;
  public challenge = 'Return sum of numbers';

  private testResultsSubscription?: Subscription;

  public constructor(private readonly challengeService: ChallengeService) {}

  ngOnInit(): void {
    this.testResultsSubscription = this.challengeService
      .getTestResults()
      .subscribe((results: any) => {
        this.testCases.forEach((testCase, idx) => {
          testCase.status = results[idx];
        });
      });

    this.challengeSubscription = this.challengeService
      .getChallenge()
      .subscribe((challenge) => {
        const challenges = challenge as { challenge: string; cases: string[] };

        this.challenge = challenges.challenge;
        this.testCases.push(
          ...challenges.cases.map(
            (testCase) => new TestCase(testCase, 'waiting')
          )
        );
      });
  }

  ngOnDestroy(): void {
    this.challengeSubscription?.unsubscribe();
    this.testResultsSubscription?.unsubscribe();
  }
}
