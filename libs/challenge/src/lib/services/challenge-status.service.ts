import { CacheClient, CACHE_PROVIDER } from '@code-battle/cache';
import { MessageTypes } from '@code-battle/common';
import { Inject, Injectable } from '@nestjs/common';

import { CHALLENGE_ROOM_REPOSIT0RY } from '../constants';
import { ChallengeRoomsGateway } from '../gateways';
import { ChallengeRoomRepository } from '../interfaces';

@Injectable()
export class ChallengeStatusService {
  constructor(
    @Inject(CHALLENGE_ROOM_REPOSIT0RY)
    private readonly challengeRoomRepository: ChallengeRoomRepository,
    @Inject(CACHE_PROVIDER)
    private readonly cacheProvider: CacheClient,
    private readonly challengeRoomGateway: ChallengeRoomsGateway
  ) {}

  public async removeChallengeRoom(roomId: string): Promise<void> {
    await this.cacheProvider.del('activeRooms');
    await this.challengeRoomRepository.markRoomAsInactive(roomId);

    this.challengeRoomGateway.server.emit(MessageTypes.RemoveChallengeRoom, {
      roomId,
    });
  }
}
