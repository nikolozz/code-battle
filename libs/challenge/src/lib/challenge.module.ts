import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsocketModule } from '@code-battle/websocket';


import { ChallengeRoomsGateway } from './gateways';
import { RemoveChallengeRoomHandler } from './commands';
import { ChallengeEntity, ChallengeRoomEntity } from './entities';

import {
  CHALLENGE_ROOM_REPOSIT0RY,
  CHALLENGE_CONFIG_TOKEN,
  CHALLENGE_REPOSITORY,
} from './constants';
import { ChallengeRepositoryImpl } from './challenge.repository';
import { ChallengeService } from './challenge.service';
import { ChallengeStatusService } from './challenge-status.service';
import { ChallengeRoomRepositoryImpl } from './challenge-room.repository';
import { ChallengeRoomService } from './challenge-room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChallengeRoomEntity, ChallengeEntity]),
    ConfigModule.forFeature(
      registerAs(CHALLENGE_CONFIG_TOKEN, () => ({
        INACTIVE_CHALLENGE_ROOM_IN_SECONDS:
          process.env.INACTIVE_CHALLENGE_ROOM_IN_SECONDS,
      }))
    ),
    WebsocketModule,
  ],
  providers: [
    ChallengeRoomService,
    ChallengeService,
    ChallengeStatusService,
    RemoveChallengeRoomHandler,
    {
      provide: CHALLENGE_ROOM_REPOSIT0RY,
      useClass: ChallengeRoomRepositoryImpl,
    },
    ChallengeRoomsGateway,
    { provide: CHALLENGE_REPOSITORY, useClass: ChallengeRepositoryImpl },
  ],
  exports: [ChallengeRoomService, ChallengeService, ChallengeRoomsGateway],
})
export class ChallengeLibModule {}
