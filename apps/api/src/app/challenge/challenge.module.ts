import { Module } from '@nestjs/common';
import { ChallengeLibModule } from '@code-battle/challenge';
import { ChallengeRoomController } from './challenge-room.controller';
import { WebsocketModule } from '@code-battle/websocket';
import { ChallengeController } from './challenge.controller';
import { ChallengeRoomsGateway } from './gateways';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ChallengeLibModule, WebsocketModule, ConfigModule],
  controllers: [ChallengeRoomController, ChallengeController],
  providers: [ChallengeRoomsGateway],
})
export class ChallengeModule {}
