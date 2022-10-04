import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  ChallengeRoomCreate,
  ChallengeDuration,
  ChallengeLevel,
  ChallengeRoom,
  RemoveChallengeRoom,
} from '@code-battle/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue, Queue } from '@code-battle/message-queue';

import * as uuid from 'uuid';

import { ChallengeRoomRepository } from '../interfaces';
import { CHALLENGE_ROOM_REPOSIT0RY } from '../constants';
import { ChallengeService } from './challenge.service';
import { CacheClient, CACHE_PROVIDER } from '@code-battle/cache';

@Injectable()
export class ChallengeRoomService {
  constructor(
    @Inject(CHALLENGE_ROOM_REPOSIT0RY)
    private readonly challengeRoomRepository: ChallengeRoomRepository,
    @Inject(CACHE_PROVIDER)
    private readonly cacheManager: CacheClient,
    @InjectQueue('CHALLENGE_QUEUE')
    private readonly challengeQueue: Queue,
    private readonly challengeService: ChallengeService,
    private readonly configService: ConfigService
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

    await this.cacheManager.del('activeRooms');

    this.challengeQueue.sendEvent<RemoveChallengeRoom>(
      'CHALLENGE_QUEUE',
      {
        id: uuid.v4(),
        body: {
          roomId: createdRoom.id,
        },
      },
      {
        delay: this.configService.get('CHALLENGE_ROOM_DELAY_BEFORE_DELETE'),
      }
    );

    return createdRoom;
  }

  public getActiveRooms(): Promise<ChallengeRoom[]> {
    return this.challengeRoomRepository.getActiveRooms();
  }

  public getChallengeRoom(id: string): Promise<ChallengeRoom> {
    return this.challengeRoomRepository.getChallengeRoom(id);
  }

  public async markRoomAsInactive(id: string): Promise<number> {
    await this.cacheManager.del('activeRooms');
    return this.challengeRoomRepository.markRoomAsInactive(id);
  }
}
