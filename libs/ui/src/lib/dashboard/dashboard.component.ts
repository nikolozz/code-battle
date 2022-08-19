import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChallengeLevel, Room, User } from '@code-battle/api-types';
import { CreateRoomComponent } from '../create-room/create-room.component';

type KRoom = Array<keyof Room>;

const rooms: Room[] = [
  { player: 'Niko', rank: 1200, level: ChallengeLevel.EASY, time: '5 Mins' },
  {
    player: 'Elina',
    rank: 1200,
    level: ChallengeLevel.MEDIUM,
    time: '10 Mins',
  },
  { player: 'Chyipo', rank: 1680, level: ChallengeLevel.EASY, time: '1 Min' },
  { player: 'Mia', rank: 1200, level: ChallengeLevel.HARD, time: '1 Min' },
  { player: 'Dato', rank: 1200, level: ChallengeLevel.MEDIUM, time: '15 Mins' },
];

@Component({
  selector: 'code-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  @Input() user?: Omit<User, 'password'> | null;

  public displayedColumns: KRoom = ['player', 'rank', 'level', 'time'];
  public dataSource = rooms;

  constructor(private readonly dialog: MatDialog) {}

  public onCreateGame(): void {
    this.dialog.open(CreateRoomComponent, {
      height: '400px',
      minWidth: '350px',
    });
  }
}
