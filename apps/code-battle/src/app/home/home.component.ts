import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import { HomeService } from './home.service';
import { AlertComponent, AuthService } from '@code-battle/ui';
import { User } from '@code-battle/api-types';

@Component({
  selector: 'code-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  public room?: string;
  public loading?: boolean;
  public user?: Omit<User, 'password'> | null;

  private getInviteSubscription?: Subscription;
  private challengeStartedSubscription?: Subscription;
  // TODO should be user be subscribed or fetched from localStorage?
  private userSub?: Subscription;

  constructor(
    private readonly homeService: HomeService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.user = user;
        return;
      }
      this.user = null;
    });

    this.getInviteSubscription = this.homeService
      .getInvite()
      .subscribe((data) => {
        const dialogRef = this.dialog.open(AlertComponent, {
          data: {
            title: 'User Joined',
            message: 'xoxlushka Joined the Game!',
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });

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
    this.userSub?.unsubscribe();
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
}
