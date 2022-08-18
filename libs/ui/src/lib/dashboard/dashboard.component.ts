import { Component, Input } from '@angular/core';
import { ChallengeLevel, Room, User } from '@code-battle/api-types';

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

  public displayedColumns: KRoom = ['player', 'rank', 'time'];
  public dataSource = rooms;
}
