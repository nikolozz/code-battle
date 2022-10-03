import { Challenge, CreateChallenge } from '@code-battle/common';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChallengeStatusService } from './challenge-status.service';
import { CHALLENGE_REPOSITORY } from './constants';
import { ChallengeRepository } from './interfaces';

@Injectable()
export class ChallengeService {
  private MAX_PLAYERS = this.configService.get('MAX_PLAYERS');

  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepository,
    private readonly challengeStatusService: ChallengeStatusService,
    private readonly configService: ConfigService
  ) {}

  public getChallengeByRoomId(challengeRoomId: string) {
    return this.challengeRepository.getChallengeByRoomId(challengeRoomId);
  }

  public async joinChallenge(
    userId: number,
    challengeRoomId: string
  ): Promise<number> {
    const challenge = await this.getChallengeByRoomId(challengeRoomId);

    this.validateChallengeRoomJoin(challenge, userId);

    const connectedPlayers = await this.challengeRepository.addPlayerToChallenge(
      userId,
      challenge.id
    );

    if (connectedPlayers === +this.MAX_PLAYERS) {
      await this.challengeStatusService.removeChallengeRoom(challengeRoomId);
    }

    return connectedPlayers;
  }

  public getChallenge(id: string): Promise<Challenge> {
    return this.challengeRepository.getChallenge(id);
  }

  public createChallenge(createChallenge: CreateChallenge): Promise<Challenge> {
    return this.challengeRepository.createChallenge(createChallenge);
  }

  private validateChallengeRoomJoin(challenge: Challenge, userId: number) {
    const challengeRoomId = challenge.challengeRoom.id;

    if (!challenge) {
      throw new BadRequestException(`${challengeRoomId} is not active.`);
    } else if (challenge.players?.find((player) => player.id === userId)) {
      throw new BadRequestException(`User ${userId} is already joined.`);
    } else if (challenge.players?.length === this.MAX_PLAYERS) {
      throw new ForbiddenException(`Room: ${challengeRoomId} is full`);
    } else {
      return void 0;
    }
  }
}
