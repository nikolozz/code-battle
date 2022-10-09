import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import 'ace-builds';
import 'ace-builds/src-noconflict/mode-typescript';
import { map, Subscription } from 'rxjs';
import { ChallengeService } from './challenge.service';

@Component({
  selector: 'code-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css'],
})
export class ChallengeComponent implements OnInit, OnDestroy {
  private codeSnippet?: string;
  private roomId?: string;

  private gameResultSubscription?: Subscription;
  private startChallengeSubscription?: Subscription;

  public gameResult?: string;
  public isGameStarted = false;

  public constructor(
    private readonly challengeService: ChallengeService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.gameResultSubscription = this.challengeService
      .getGameResult()
      .pipe(map((result) => (result === 'win' ? 'You won!' : 'You Lose')))
      .subscribe((result) => {
        this.gameResult = result as string;
      });

    this.startChallengeSubscription = this.challengeService
      .startChallenge()
      .subscribe(() => {
        this.isGameStarted = true;
      });

    this.activatedRoute.params.subscribe((params) => {
      this.challengeService.joinChallenge(params['id']);
      this.roomId = params['id'];
    });
  }

  public ngOnDestroy(): void {
    this.gameResultSubscription?.unsubscribe();
    this.startChallengeSubscription?.unsubscribe();
  }

  public onTest(): void {
    if (this.codeSnippet && this.roomId) {
      this.challengeService.testCode(this.roomId, this.codeSnippet);
    }
  }

  public onSubmit(): void {
    if (this.codeSnippet && this.roomId) {
      this.challengeService.testCode(this.roomId, this.codeSnippet);
    }
  }

  public onCodeChange(code: string) {
    this.codeSnippet = code;
  }

  public onTimerComplete() {
    this.onGameOver();
  }

  public onGameOver() {
    this.router.navigate(['../home']);
  }
}
