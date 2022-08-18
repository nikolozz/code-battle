import { ChallengeLevel } from '../../challenge';

export interface Room {
  player: string;
  rank: number;
  level: ChallengeLevel;
  time: string;
}
