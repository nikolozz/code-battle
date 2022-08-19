import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChallengeCreate, DashboardChallengeRoom } from '@code-battle/common';
import { CreateRoomComponent } from '../create-room/create-room.component';

type KRoom = Array<keyof DashboardChallengeRoom>;

@Component({
  selector: 'code-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  @Input() isAuthenticated = false;
  @Input() rooms: DashboardChallengeRoom[] = [];
  @Output() createRoomEvent = new EventEmitter<ChallengeCreate>();

  public displayedColumns: KRoom = ['player', 'rank', 'level', 'time'];

  constructor(private readonly dialog: MatDialog) {}

  public onCreateGame(): void {
    const dialogRef = this.dialog.open(CreateRoomComponent, {
      height: '400px',
      minWidth: '350px',
    });

    dialogRef
      .afterClosed()
      .subscribe((data) => this.createRoomEvent.emit(data));
  }
}
