import { Challenge, CreateChallenge, MessageTypes } from '@code-battle/common';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChallengeStatusService } from './challenge-status.service';
import { CHALLENGE_REPOSITORY } from '../constants';
import { ChallengeRepository } from '../interfaces';
import { ChallengeRoomsGateway } from '../gateways';

@Injectable()
export class ChallengeService {
  private MAX_PLAYERS = this.configService.get('MAX_PLAYERS');

  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepository,
    private readonly challengeStatusService: ChallengeStatusService,
    private readonly configService: ConfigService,
    private readonly challengeRoomGateway: ChallengeRoomsGateway
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
      await this.startChallenge(challengeRoomId);
    }

    return connectedPlayers;
  }

  public getChallenge(id: string): Promise<Challenge> {
    return this.challengeRepository.getChallenge(id);
  }

  public createChallenge(createChallenge: CreateChallenge): Promise<Challenge> {
    return this.challengeRepository.createChallenge(createChallenge);
  }

  private async startChallenge(challengeRoomId: string): Promise<void> {
    await this.challengeStatusService.removeChallengeRoom(challengeRoomId);

    this.challengeRoomGateway.server.emit(MessageTypes.RemoveChallengeRoom, {
      challengeRoomId,
    });
  }

  private validateChallengeRoomJoin(challenge: Challenge, userId: number) {
    if (!challenge) {
      throw new BadRequestException(`Challenge is not active.`);
    } else if (challenge.players?.find((player) => player.id === userId)) {
      throw new BadRequestException(`User ${userId} is already joined.`);
    } else if (challenge.players?.length === this.MAX_PLAYERS) {
      throw new ForbiddenException(
        `Room: ${challenge?.challengeRoom?.id} is full`
      );
    } else {
      return void 0;
    }
  }
}
