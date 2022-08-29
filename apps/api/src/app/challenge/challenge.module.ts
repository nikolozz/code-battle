import { Module } from '@nestjs/common';
import { ChallengeLibModule } from '@code-battle/challenge';
import { ChallengeRoomController } from './challenge-room.controller';
import { WebsocketModule } from '@code-battle/websocket';

@Module({
  imports: [ChallengeLibModule, WebsocketModule],
  controllers: [ChallengeRoomController],
})
export class ChallengeModule {}
