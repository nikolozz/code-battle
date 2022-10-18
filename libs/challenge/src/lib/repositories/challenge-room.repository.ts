import { ChallengeRoomCreate, ChallengeRoom } from '@code-battle/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChallengeRoomEntity } from '../entities';
import { ChallengeRoomRepository } from '../interfaces';

@Injectable()
export class ChallengeRoomRepositoryImpl implements ChallengeRoomRepository {
  constructor(
    @InjectRepository(ChallengeRoomEntity)
    private readonly challengeRoom: Repository<ChallengeRoomEntity>
  ) {}

  public getChallengeRoom(id: string): Promise<ChallengeRoom> {
    return this.challengeRoom.findOne({ where: { id } });
  }

  public markRoomAsInactive(roomId: string): Promise<number> {
    return this.challengeRoom
      .update(roomId, { active: false })
      .then((result) => result.affected);
  }

  public getActiveRooms(): Promise<ChallengeRoom[]> {
    const queryBuilder = this.challengeRoom
      .createQueryBuilder('challengeRoom')
      .select([
        'challengeRoom.id',
        'challengeRoom.duration',
        'challengeRoom.challengeId',
        'challengeRoom.level',
        'challengeRoom.active',
      ])
      .leftJoinAndSelect('challengeRoom.challenge', 'challenge');

    queryBuilder
      .where('challengeRoom.active = :active', { active: true })
      .andWhere('challengeRoom.isPrivate = :isPrivate', { isPrivate: false });

    return queryBuilder.getMany();
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
