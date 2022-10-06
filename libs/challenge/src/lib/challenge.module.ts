import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsocketModule } from '@code-battle/websocket';

import { RemoveChallengeRoomHandler } from './commands';
import { ChallengeEntity, ChallengeRoomEntity } from './entities';

import {
  CHALLENGE_ROOM_REPOSIT0RY,
  CHALLENGE_CONFIG_TOKEN,
  CHALLENGE_REPOSITORY,
} from './constants';
import {
  ChallengeRepositoryImpl,
  ChallengeRoomRepositoryImpl,
} from './repositories';
import {
  ChallengeService,
  ChallengeStatusService,
  ChallengeRoomService,
} from './services/';

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
    { provide: CHALLENGE_REPOSITORY, useClass: ChallengeRepositoryImpl },
  ],
  exports: [ChallengeRoomService, ChallengeService],
})
export class ChallengeLibModule {}
