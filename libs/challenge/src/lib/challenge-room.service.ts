import {
  ChallengeCreate,
  ChallengeDuration,
  ChallengeLevel,
  ChallengeRoom,
  RemoveChallengeRoom,
} from '@code-battle/common';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import * as uuid from 'uuid';

import { ChallengeRoomRepository } from './interfaces';
import { CHALLENGE_ROOM_REPOSIT0RY } from './constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChallengeRoomService {
  constructor(
    @Inject(CHALLENGE_ROOM_REPOSIT0RY)
    private readonly challengeRoomRepository: ChallengeRoomRepository,
    private readonly sqsService: SqsService,
    private readonly configService: ConfigService
  ) {}

  public async createRoom(
    userId: number,
    room: ChallengeCreate
  ): Promise<ChallengeRoom> {
    try {
      const createdRoom = await this.challengeRoomRepository.createRoom(
        userId,
        {
          ...room,
          level: ChallengeLevel[room.level],
          duration: ChallengeDuration[room.duration],
        }
      );

      this.sqsService.send<RemoveChallengeRoom>(
        'INACTIVE_CHALLENGE_ROOM_QUEUE',
        {
          id: uuid.v4(),
          body: { roomId: createdRoom.id },
          delaySeconds: parseInt(
            this.configService.get('INACTIVE_CHALLENGE_ROOM_IN_SECONDS')
          ),
        }
      );

      return createdRoom;
    } catch (error) {
      if (error?.code === '23505') {
        throw new HttpException(
          "You've already created the challenge",
          HttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public getActiveRooms(): Promise<ChallengeRoom[]> {
    return this.challengeRoomRepository.getActiveRooms();
  }

  public async removeChallengeRoom(roomId: string): Promise<void> {
    // TODO Get ChallengeGame -> players from Redis and check if challenge room has active user.
    const isChallengeRoomActive = false;

    if (isChallengeRoomActive) {
      return void 0;
    }

    await this.challengeRoomRepository.markRoomAsInactive(roomId);
  }
}
