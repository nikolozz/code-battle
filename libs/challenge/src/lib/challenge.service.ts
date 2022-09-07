import { Challenge, CreateChallenge } from '@code-battle/common';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CHALLENGE_REPOSITORY } from './constants';
import { ChallengeRepository } from './interfaces';

@Injectable()
export class ChallengeService {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepository,
    private readonly configService: ConfigService
  ) {}

  public async joinChallenge(userId: number, challengeRoomId: string) {
    const challenge = await this.challengeRepository.getChallengeByRoomId(
      challengeRoomId
    );

    if (challenge.players?.find((player) => player.id === userId)) {
      throw new BadRequestException(`User ${userId} is already joined.`);
    }

    if (
      challenge.players?.length ===
      this.configService.get('MAX_PLAYERS_PER_ROOM')
    ) {
      throw new ForbiddenException(`Room: ${challengeRoomId} is full`);
    }

    const isConnected = await this.challengeRepository.addPlayerToChallenge(
      userId,
      challenge.id
    );

    return isConnected;
  }

  public getChallenge(id: string): Promise<Challenge> {
    return this.challengeRepository.getChallenge(id);
  }

  public createChallenge(createChallenge: CreateChallenge): Promise<Challenge> {
    return this.challengeRepository.createChallenge(createChallenge);
  }
}
