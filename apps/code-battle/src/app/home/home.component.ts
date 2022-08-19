import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { catchError, map, Subscription, throwError } from 'rxjs';
import { HomeService } from './home.service';
import { AlertComponent, AuthService } from '@code-battle/ui';
import {
  BaseUser,
  ChallengeCreate,
  DashboardChallengeRoom,
} from '@code-battle/common';

@Component({
  selector: 'code-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  public loading?: boolean;
  public user?: BaseUser | null;

  public rooms: DashboardChallengeRoom[] = [];

  // TODO should be user be subscribed or fetched from localStorage?
  private userSub?: Subscription;

  private challengeRoomsSub?: Subscription;

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

    this.challengeRoomsSub = this.homeService
      .getActiveChallengeRooms()
      .pipe(
        map((rooms) => {
          return rooms.map((room) => ({
            player: room.createdBy.username,
            // Todo fix workaround with "|| 0"
            rank: room.createdBy.rank || 0,
            level: room.level,
            time: room.duration,
          }));
        })
      )
      .subscribe((rooms: DashboardChallengeRoom[]) => {
        this.rooms = rooms;
      });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.challengeRoomsSub?.unsubscribe();
  }

  public async onCreateRoom(event: ChallengeCreate): Promise<void> {
    this.homeService
      .createRoom(event)
      .pipe(
        catchError((error) => {
          this.dialog.open(AlertComponent, {
            data: {
              title: 'Cannot create a challenge',
              message:
                'Sorry we are unable to create a challenge at current time',
            },
          });
          console.log(error);
          return throwError(() => new Error('Cannot create room'));
        })
      )
      .subscribe((value) => {
        this.dialog.open(AlertComponent, {
          data: {
            title: 'Challenge Created',
            message: 'You have created challenge ' + value.id,
          },
        });
      });
  }
}
