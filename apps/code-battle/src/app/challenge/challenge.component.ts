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

  public gameResult?: string;

  public constructor(
    private readonly challengeService: ChallengeService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    // TODO RxJS pipe map to send WIN or LOSE in uppercase
    this.gameResultSubscription = this.challengeService
      .getGameResult()
      .pipe(map((result) => (result === 'win' ? 'You won!' : 'You Lose')))
      .subscribe((result) => {
        this.gameResult = result as string;
      });

    this.activatedRoute.params.subscribe((params) => {
      console.log(params['id']);
      this.roomId = params['id'];
    });
  }

  public ngOnDestroy(): void {
    this.gameResultSubscription?.unsubscribe();
  }

  public onTest(): void {
    if (this.codeSnippet && this.roomId) {
      this.challengeService.testCode(this.roomId, this.codeSnippet);
    }
  }

  public onSubmit(): void {
    console.log(this.codeSnippet, this.roomId);
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
