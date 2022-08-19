import {
  ChallengeCreate,
  ChallengeDuration,
  ChallengeLevel,
  ChallengeRoom,
} from '@code-battle/common';
import { Inject, Injectable } from '@nestjs/common';
import { ChallengeRoomRepository } from './interfaces';
import { CHALLENGE_ROOM_REPOSIT0RY } from './constants';

@Injectable()
export class ChallengeRoomService {
  constructor(
    @Inject(CHALLENGE_ROOM_REPOSIT0RY)
    private readonly challengeRoomRepository: ChallengeRoomRepository
  ) {}

  public createRoom(
    userId: number,
    room: ChallengeCreate
  ): Promise<ChallengeRoom> {
    return this.challengeRoomRepository.createRoom(userId, {
      ...room,
      level: ChallengeLevel[room.level],
      duration: ChallengeDuration[room.duration],
    });
  }

  public getActiveRooms(): Promise<ChallengeRoom[]> {
    return this.challengeRoomRepository.getActiveRooms();
  }
}
