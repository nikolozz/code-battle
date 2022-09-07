import { ChallengeDuration, ChallengeLevel } from '../enums';

export interface ChallengeRoomCreate {
  readonly level: ChallengeLevel;
  readonly duration: ChallengeDuration;
  readonly isPrivate: boolean;
}
