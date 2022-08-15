import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HomeService } from './home.service';

@Component({
  selector: 'code-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  public invited?: boolean;
  public room?: string;
  public loading?: boolean;

  private getInviteSubscription?: Subscription;
  private challengeStartedSubscription?: Subscription;

  constructor(
    private readonly homeService: HomeService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getInviteSubscription = this.homeService
      .getInvite()
      .subscribe((data) => {
        this.invited = true;
        this.room = data as string;
      });

    this.challengeStartedSubscription = this.homeService
      .challengeStarted()
      .subscribe((data) => {
        this.router.navigate(['../challenge', data]);
      });
  }

  public ngOnDestroy(): void {
    this.getInviteSubscription?.unsubscribe();
    this.challengeStartedSubscription?.unsubscribe();
  }

  public onStartChallenge() {
    this.loading = true;
    this.homeService.startChallenge();
  }

  public onAcceptChallenge() {
    if (this.room) {
      this.loading = false;
      this.homeService.acceptChallenge(this.room);
    }
  }

  public onCloseAlert() {
    this.invited = false;
  }
}
