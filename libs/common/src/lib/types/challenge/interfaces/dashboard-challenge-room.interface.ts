import { ChallengeDuration, ChallengeLevel } from '../enums';

export interface DashboardChallengeRoom {
  player: string;
  rank: number;
  level: ChallengeLevel;
  time: ChallengeDuration;
}
