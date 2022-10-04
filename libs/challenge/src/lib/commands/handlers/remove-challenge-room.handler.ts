import { RemoveChallengeRoom } from '@code-battle/common';
import { EventMessage, Process } from '@code-battle/message-queue';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ChallengeRoomService, ChallengeStatusService } from '../../services';

@Injectable()
export class RemoveChallengeRoomHandler {
  constructor(
    private readonly challengeStatusService: ChallengeStatusService,
    private readonly challengeRoomService: ChallengeRoomService,
    private readonly configService: ConfigService
  ) {}

  @Process('CHALLENGE_QUEUE')
  public async challengeRooms(message: EventMessage<RemoveChallengeRoom>) {
    const { data } = message;

    const { challenge } = await this.challengeRoomService.getChallengeRoom(
      data.body.roomId
    );

    if (
      challenge.players.length > 0 &&
      challenge.players.length < this.configService.get('MAX_PLAYERS')
    ) {
      return void 0;
    }

    await this.challengeStatusService.removeChallengeRoom(data.body.roomId);
  }
}
