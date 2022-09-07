import { ChallengeRoomCreate, ChallengeRoom } from '@code-battle/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { ChallengeRoomEntity } from './entities';
import { ChallengeRoomRepository, GetActiveRooms } from './interfaces';

@Injectable()
export class ChallengeRoomRepositoryImpl implements ChallengeRoomRepository {
  constructor(
    @InjectRepository(ChallengeRoomEntity)
    private readonly challengeRoom: Repository<ChallengeRoom>
  ) {}

  public markRoomAsInactive(roomId: string): Promise<number> {
    return this.challengeRoom
      .update(roomId, { active: false })
      .then((result) => result.affected);
  }

  public getActiveRooms(options: GetActiveRooms): Promise<ChallengeRoom[]> {
    const findOptions: FindManyOptions<ChallengeRoom> = {
      where: { active: true },
    };

    if (options?.userId) {
      findOptions.where = {
        ...findOptions.where,
        createdBy: { id: options.userId },
      };
    }

    return this.challengeRoom.find(findOptions);
  }

  public async createRoom(
    userId: number,
    room: ChallengeRoomCreate
  ): Promise<ChallengeRoom> {
    const challengeRoom = this.challengeRoom.create({
      ...room,
      createdBy: { id: userId },
    });

    await this.challengeRoom.save(challengeRoom);

    return challengeRoom;
  }
}
