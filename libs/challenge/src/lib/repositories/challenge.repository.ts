import { Challenge, CreateChallenge } from '@code-battle/common';
import { UserEntity } from '@code-battle/user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChallengeEntity, ChallengeRoomEntity } from '../entities';
import { ChallengeRepository } from '../interfaces';

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

  public getChallengeByUser(userId: number): Promise<Challenge> {
    return this.challenge.findOne({
      where: { players: { id: userId } },
    });
  }

  public async getChallengeByRoomId(id: string): Promise<Challenge> {
    return this.challenge
      .createQueryBuilder('challenge')
      .leftJoinAndMapOne(
        'challenge.challengeRoom',
        ChallengeRoomEntity,
        'cr',
        '"challenge"."challengeRoomId" = "cr"."id"'
      )
      .leftJoinAndMapMany(
        'challenge.players',
        UserEntity,
        'u',
        '"challenge"."id"  = "u"."challengesId"'
      )
      .where('"challenge"."challengeRoomId" = :id', { id })
      .getOne();
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
