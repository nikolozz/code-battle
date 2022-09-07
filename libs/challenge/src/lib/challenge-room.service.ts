import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ChallengeRoomCreate,
  ChallengeDuration,
  ChallengeLevel,
  ChallengeRoom,
  RemoveChallengeRoom,
} from '@code-battle/common';
import { SqsService } from '@ssut/nestjs-sqs';
import * as uuid from 'uuid';

import { ChallengeRoomRepository } from './interfaces';
import { CHALLENGE_ROOM_REPOSIT0RY } from './constants';
import { ChallengeService } from './challenge.service';

@Injectable()
export class ChallengeRoomService {
  constructor(
    @Inject(CHALLENGE_ROOM_REPOSIT0RY)
    private readonly challengeRoomRepository: ChallengeRoomRepository,
    private readonly sqsService: SqsService,
    private readonly configService: ConfigService,
    private readonly challengeService: ChallengeService
  ) {}

  public async createRoom(
    userId: number,
    room: ChallengeRoomCreate
  ): Promise<ChallengeRoom> {
    const activeUserRooms = await this.challengeRoomRepository.getActiveRooms({
      userId,
    });
    if (activeUserRooms?.length) {
      throw new HttpException(
        "You've already created the challenge",
        HttpStatus.BAD_REQUEST
      );
    }

    // TODO Add Transaction
    const createdRoom = await this.challengeRoomRepository.createRoom(userId, {
      ...room,
      // TODO should be deleted enum access after creating level, duration tables
      level: ChallengeLevel[room.level],
      duration: ChallengeDuration[room.duration],
    });

    await this.challengeService.createChallenge({
      challengeRoomId: createdRoom.id,
      players: [{ id: userId }],
    });

    this.sqsService.send<RemoveChallengeRoom>('INACTIVE_CHALLENGE_ROOM_QUEUE', {
      id: uuid.v4(),
      body: { roomId: createdRoom.id },
      delaySeconds: parseInt(
        this.configService.get('INACTIVE_CHALLENGE_ROOM_IN_SECONDS')
      ),
    });

    return createdRoom;
  }

  public getActiveRooms(): Promise<ChallengeRoom[]> {
    return this.challengeRoomRepository.getActiveRooms();
  }

  public async removeChallengeRoom(roomId: string): Promise<void> {
    // TODO Get ChallengeGame -> players from DB and check if challenge room has active user.
    const isChallengeRoomActive = false;

    if (isChallengeRoomActive) {
      return void 0;
    }

    await this.challengeRoomRepository.markRoomAsInactive(roomId);
  }
}
