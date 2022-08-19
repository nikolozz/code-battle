import { ChallengeCreate, ChallengeRoom } from '@code-battle/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChallengeRoomEntity } from './entities';
import { ChallengeRoomRepository } from './interfaces';

@Injectable()
export class ChallengeRepository implements ChallengeRoomRepository {
  constructor(
    @InjectRepository(ChallengeRoomEntity)
    private readonly challengeRoom: Repository<ChallengeRoom>
  ) {}

  getActiveRooms(): Promise<ChallengeRoom[]> {
    return this.challengeRoom.find({ where: { active: true } });
  }

  async createRoom(
    userId: number,
    room: ChallengeCreate
  ): Promise<ChallengeRoom> {
    const challengeRoom = this.challengeRoom.create({
      ...room,
      createdBy: { id: userId },
    });

    await this.challengeRoom.save(challengeRoom);

    return challengeRoom;
  }
}
