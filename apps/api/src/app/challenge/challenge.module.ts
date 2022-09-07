import { Module } from '@nestjs/common';
import { ChallengeLibModule } from '@code-battle/challenge';
import { ChallengeRoomController } from './challenge-room.controller';
import { WebsocketModule } from '@code-battle/websocket';
import { ChallengeController } from './challenge.controller';

@Module({
  imports: [ChallengeLibModule, WebsocketModule],
  controllers: [ChallengeRoomController, ChallengeController],
})
export class ChallengeModule {}
