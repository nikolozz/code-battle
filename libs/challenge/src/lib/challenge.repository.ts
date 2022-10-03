import { Challenge, CreateChallenge } from '@code-battle/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChallengeEntity } from './entities';
import { ChallengeRepository } from './interfaces';

@Injectable()
export class ChallengeRepositoryImpl implements ChallengeRepository {
  constructor(
    @InjectRepository(ChallengeEntity)
    private readonly challenge: Repository<ChallengeEntity>
  ) {}

  public getChallenge(id: string): Promise<Challenge> {
    return this.challenge.findOne({
      where: { id },
    });
  }

  public getChallengeByRoomId(id: string): Promise<Challenge> {
    return this.challenge.findOne({
      where: { challengeRoom: { id, active: true } },
      relations: ['challengeRoom'],
    });
  }

  public async createChallenge(
    createChallenge: CreateChallenge
  ): Promise<Challenge> {
    const createdChallenge = this.challenge.create(createChallenge);

    await this.challenge.save(createChallenge);

    return createdChallenge;
  }

  public async addPlayerToChallenge(
    userId: number,
    challengeId: string
  ): Promise<number> {
    const challenge = await this.getChallenge(challengeId);

    if (challenge.players.find((player) => player.id === userId)) {
      throw new Error(`User ${userId} is already joined`);
    }

    // TODO rewrite to raw sql to avoid createdAt, updatedAt manual update
    const updateResult = await this.challenge.save({
      ...challenge,
      players: [...challenge.players, { id: userId }],
      createdAt: challenge.createdAt,
      updatedAt: new Date(),
    });

    return updateResult.players.length;
  }
}
