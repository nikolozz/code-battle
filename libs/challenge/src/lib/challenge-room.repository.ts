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

  public markRoomAsInactive(roomId: string): Promise<number> {
    return this.challengeRoom
      .update(roomId, { active: false })
      .then((result) => result.affected);
  }

  public getActiveRooms(): Promise<ChallengeRoom[]> {
    return this.challengeRoom.find({ where: { active: true } });
  }

  public async createRoom(
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
