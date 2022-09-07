import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  BaseUser,
  ChallengeRoomCreate,
  DashboardChallengeRoom,
} from '@code-battle/common';
import { AlertComponent } from '../alert/alert.component';
import { CreateRoomComponent } from '../create-room/create-room.component';
import { DialogComponent } from '../dialog/dialog.component';
import { DashboardService } from './dashboard.service';

type KRoom = Array<keyof DashboardChallengeRoom>;

@Component({
  selector: 'code-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  @Input() user?: BaseUser | null;
  @Input() rooms: DashboardChallengeRoom[] = [];
  @Output() createRoomEvent = new EventEmitter<ChallengeRoomCreate>();

  public displayedColumns: KRoom = ['player', 'rank', 'level', 'time'];

  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly dashboardService: DashboardService
  ) {}

  public onChallengeRoomSelect(room: DashboardChallengeRoom): void {
    if (!this.user) {
      this.dialog.open(AlertComponent, {
        hasBackdrop: false,
        data: {
          title: 'You are not allowed to join game',
          message: 'Please Sign Up or Sign In to join a challenge.',
        },
      });

      return void 0;
    }

    if (this.user?.username === room.player) {
      this.router.navigate(['../challenge/', room.id]);
      return void 0;
    }

    const dialogRef = this.dialog.open(DialogComponent, {
      hasBackdrop: false,
      data: {
        title: 'Are you ready for battle?',
        message: `You are joining to room ${room.id}`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.joinGame(room.id);
      }
    });
  }

  public onCreateGame(): void {
    const dialogRef = this.dialog.open(CreateRoomComponent, {
      height: '400px',
      minWidth: '350px',
    });

    dialogRef
      .afterClosed()
      .subscribe((data) => this.createRoomEvent.emit(data));
  }

  private joinGame(roomId: string) {
    this.dashboardService.joinChallenge(roomId).subscribe((isJoinRequest) => {
      if (isJoinRequest) {
        this.router.navigate(['../challenge/', roomId]);
      }
    });
  }
}
