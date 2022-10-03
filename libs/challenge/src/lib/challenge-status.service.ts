import { MessageTypes } from '@code-battle/common';
import { Inject, Injectable } from '@nestjs/common';

import { CHALLENGE_ROOM_REPOSIT0RY } from './constants';
import { ChallengeRoomsGateway } from './gateways';
import { ChallengeRoomRepository } from './interfaces';

@Injectable()
export class ChallengeStatusService {
  constructor(
    @Inject(CHALLENGE_ROOM_REPOSIT0RY)
    private readonly challengeRoomRepository: ChallengeRoomRepository,
    private readonly challengeRoomGateway: ChallengeRoomsGateway
  ) {}

  public async removeChallengeRoom(roomId: string): Promise<void> {
    await this.challengeRoomRepository.markRoomAsInactive(roomId);

    this.challengeRoomGateway.server.emit(MessageTypes.RemoveChallengeRoom, {
      roomId,
    });
  }
}
