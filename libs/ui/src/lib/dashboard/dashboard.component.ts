import { Component, Input } from '@angular/core';
import { User } from '@code-battle/api-types';

// TODO move Room to lib/api-types
export interface Room {
  player: string;
  rank: number;
  time: string;
}

type KRoom = Array<keyof Room>;

const rooms: Room[] = [
  { player: 'Niko', rank: 1200, time: '5 Mins' },
  { player: 'Elina', rank: 1200, time: '10 Mins' },
  { player: 'Chyipo', rank: 1200, time: '1 Min' },
  { player: 'Mia', rank: 1200, time: '1 Min' },
  { player: 'Dato', rank: 1200, time: '15 Mins' },
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
