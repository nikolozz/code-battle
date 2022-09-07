import {
  ChallengeRoomCreate,
  ChallengeDuration,
  ChallengeLevel,
} from '@code-battle/common';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateChallengeDto implements ChallengeRoomCreate {
  @IsNotEmpty()
  // Todo add when ChallengeLevel & Duration will be moved as separate tables
  // @IsEnum(ChallengeLevel)
  level: ChallengeLevel;

  @IsNotEmpty()
  // @IsEnum(ChallengeLevel)
  duration: ChallengeDuration;

  @IsNotEmpty()
  @IsBoolean()
  isPrivate: boolean;
}
