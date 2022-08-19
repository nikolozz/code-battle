import { ChallengeDuration, ChallengeLevel } from '../enums';

export interface ChallengeCreate {
  readonly level: ChallengeLevel;
  readonly duration: ChallengeDuration;
  readonly isPrivate: boolean;
}
