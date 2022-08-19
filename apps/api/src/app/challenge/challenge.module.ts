import { Module } from '@nestjs/common';
import { ChallengeLibModule } from '@code-battle/challenge';
import { ChallengeRoomController } from './challenge-room.controller';

@Module({
  imports: [ChallengeLibModule],
  controllers: [ChallengeRoomController],
})
export class ChallengeModule {}
