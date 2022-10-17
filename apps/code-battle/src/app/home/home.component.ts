import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { catchError, map, Subscription, tap, throwError } from 'rxjs';
import { HomeService } from './home.service';
import { AlertComponent, AuthService } from '@code-battle/ui';
import {
  BaseUser,
  ChallengeRoomCreate,
  DashboardChallengeRoom,
  MessageTypes,
  RemoveChallengeRoom,
} from '@code-battle/common';
import { WebsocketService } from '@code-battle/ui/websocket';
import { Router } from '@angular/router';

@Component({
  selector: 'code-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  public user?: BaseUser | null;

  public loading = false;
  public isRoomCreated = false;

  public rooms: DashboardChallengeRoom[] = [];

  private userSub?: Subscription;

  private challengeRoomsSub?: Subscription;
  private createChallengeRoomSub?: Subscription;
  private challengeRoomCreatedSub?: Subscription;
  private challengeRoomRemovedSub?: Subscription;

  private handleWsUnauthorizedSub?: Subscription;

  constructor(
    private readonly homeService: HomeService,
    private readonly dialog: MatDialog,
    private readonly wsService: WebsocketService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // TODO should be only one source of truth for user
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
            id: room.id,
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

    this.challengeRoomCreatedSub = this.wsService
      .fromEvent<DashboardChallengeRoom>(MessageTypes.ChallengeRoomCreated)
      .subscribe((data) => {
        this.rooms = [...this.rooms, data];
      });

    this.challengeRoomRemovedSub = this.wsService
      .fromEvent<RemoveChallengeRoom>(MessageTypes.RemoveChallengeRoom)
      .subscribe((data) => {
        this.rooms = this.rooms.filter((room) => room.id !== data.roomId);
      });

    this.handleWsUnauthorizedSub = this.wsService
      .fromEvent(MessageTypes.Unauthorized)
      .pipe(
        tap(() => {
          if (localStorage.getItem('user')) {
            this.wsService.emit(MessageTypes.Reconnect, '');
          }
        })
      )
      .subscribe();
  }

  public async onCreateRoom(event: ChallengeRoomCreate): Promise<void> {
    this.createChallengeRoomSub = this.homeService
      .createRoom(event)
      .pipe(
        catchError((error) => {
          this.dialog.open(AlertComponent, {
            data: {
              title: 'Cannot create a challenge',
              message: error?.error?.message,
            },
          });

          return throwError(() => new Error('Cannot create room'));
        })
      )
      .subscribe((value) => {
        if (this.user) {
          const room: DashboardChallengeRoom = {
            id: value.id,
            player: this.user.username,
            rank: this.user.rank || 0,
            level: value.level,
            time: value.duration,
          };

          this.rooms = [...this.rooms, room];

          this.wsService.emit(MessageTypes.CreateChallengeRoom, room);
          this.router.navigate(['../challenge/', value.id]);
        }

        this.dialog.open(AlertComponent, {
          data: {
            title: 'Challenge Created',
            message: 'You have created challenge ' + value.id,
          },
        });
      });
  }

  public ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.challengeRoomsSub?.unsubscribe();
    this.createChallengeRoomSub?.unsubscribe();
    this.challengeRoomCreatedSub?.unsubscribe();
    this.challengeRoomRemovedSub?.unsubscribe();
    this.handleWsUnauthorizedSub?.unsubscribe();
  }
}
