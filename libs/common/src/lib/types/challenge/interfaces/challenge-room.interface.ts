import { BaseUser } from '../../user';
import { ChallengeDuration, ChallengeLevel } from '../enums';

export interface ChallengeRoom {
  id: string;
  duration: ChallengeDuration;
  level: ChallengeLevel;
  createdBy: BaseUser;
  createdAt: Date;
  active: boolean;
  isPrivate: boolean;
}
