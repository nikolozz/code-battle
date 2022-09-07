import { ChallengeDuration, ChallengeLevel } from '../enums';

export interface DashboardChallengeRoom {
  id: string;
  player: string;
  rank: number;
  level: ChallengeLevel;
  time: ChallengeDuration;
}
