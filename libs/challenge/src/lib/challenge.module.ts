import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@ssut/nestjs-sqs';
import { WebsocketModule } from '@code-battle/websocket';

import { ChallengeRepository } from './challenge-room.repository';
import { ChallengeRoomService } from './challenge-room.service';
import { ChallengeRoomsGateway } from './gateways';
import { RemoveChallengeRoomHandler } from './commands';
import { ChallengeRoomEntity } from './entities';

import {
  CHALLENGE_QUEUE_CONFIG_TOKEN,
  CHALLENGE_ROOM_REPOSIT0RY,
  CHALLENGE_CONFIG_TOKEN,
} from './constants';


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
    TypeOrmModule.forFeature([ChallengeRoomEntity]),
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
    RemoveChallengeRoomHandler,
    { provide: CHALLENGE_ROOM_REPOSIT0RY, useClass: ChallengeRepository },
    ChallengeRoomsGateway,
  ],
  exports: [ChallengeRoomService, ChallengeRoomsGateway],
})
export class ChallengeLibModule {}
