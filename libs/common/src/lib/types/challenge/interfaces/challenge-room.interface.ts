import { BaseUser } from '../../user';
import { ChallengeDuration, ChallengeLevel } from '../enums';
import { Challenge } from './challenge.interface';

export interface ChallengeRoom {
  id: string;
  duration: ChallengeDuration;
  level: ChallengeLevel;
  challenge: Challenge;
  createdBy: BaseUser;
  createdAt: Date;
  active: boolean;
  isPrivate: boolean;
}
