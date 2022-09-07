import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@ssut/nestjs-sqs';
import { WebsocketModule } from '@code-battle/websocket';

import { ChallengeRoomRepositoryImpl } from './challenge-room.repository';
import { ChallengeRoomService } from './challenge-room.service';
import { ChallengeRoomsGateway } from './gateways';
import { RemoveChallengeRoomHandler } from './commands';
import { ChallengeEntity, ChallengeRoomEntity } from './entities';

import {
  CHALLENGE_QUEUE_CONFIG_TOKEN,
  CHALLENGE_ROOM_REPOSIT0RY,
  CHALLENGE_CONFIG_TOKEN,
  CHALLENGE_REPOSITORY,
} from './constants';
import { ChallengeRepositoryImpl } from './challenge.repository';
import { ChallengeService } from './challenge.service';

const challengeConfig = registerAs(CHALLENGE_QUEUE_CONFIG_TOKEN, () => ({
  INACTIVE_CHALLENGE_ROOM_QUEUE: process.env.INACTIVE_CHALLENGE_ROOM_QUEUE,
  INACTIVE_CHALLENGE_ROOM_QUEUE_URL:
    process.env.INACTIVE_CHALLENGE_ROOM_QUEUE_URL,
  AWS_REGION: process.env.AWS_REGION,
  INACTIVE_CHALLENGE_ROOM_IN_SECONDS:
    process.env.INACTIVE_CHALLENGE_ROOM_IN_SECONDS,
}));

@Module({
  imports: [
    TypeOrmModule.forFeature([ChallengeRoomEntity, ChallengeEntity]),
    ConfigModule.forFeature(
      registerAs(CHALLENGE_CONFIG_TOKEN, () => ({
        INACTIVE_CHALLENGE_ROOM_IN_SECONDS:
          process.env.INACTIVE_CHALLENGE_ROOM_IN_SECONDS,
      }))
    ),
    SqsModule.registerAsync({
      imports: [ConfigModule.forFeature(challengeConfig)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        producers: [
          {
            name: configService.get('INACTIVE_CHALLENGE_ROOM_QUEUE'),
            queueUrl: configService.get('INACTIVE_CHALLENGE_ROOM_QUEUE_URL'),
            region: configService.get('AWS_REGION'),
          },
        ],
        consumers: [
          {
            name: configService.get('INACTIVE_CHALLENGE_ROOM_QUEUE'),
            queueUrl: configService.get('INACTIVE_CHALLENGE_ROOM_QUEUE_URL'),
            region: configService.get('AWS_REGION'),
          },
        ],
      }),
    }),
    WebsocketModule,
  ],
  providers: [
    ChallengeRoomService,
    ChallengeService,
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
