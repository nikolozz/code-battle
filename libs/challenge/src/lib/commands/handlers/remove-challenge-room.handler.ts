import { MessageTypes, RemoveChallengeRoom } from '@code-battle/common';
import { EventMessage, Process } from '@code-battle/message-queue';
import { Injectable } from '@nestjs/common';
import { ChallengeRoomService } from '../../challenge-room.service';
import { ChallengeRoomsGateway } from '../../gateways/challenge-room.gateway';

@Injectable()
export class RemoveChallengeRoomHandler {
  constructor(
    private readonly challengeRoomService: ChallengeRoomService,
    private readonly challengeRoomGateway: ChallengeRoomsGateway
  ) {}

  @Process('CHALLENGE_QUEUE')
  public async challengeRooms(message: EventMessage<RemoveChallengeRoom>) {
    const { data } = message;

    await this.challengeRoomService.removeChallengeRoom(data.body.roomId);

    this.challengeRoomGateway.server.emit(MessageTypes.RemoveChallengeRoom, {
      roomId: data.body.roomId,
    });
  }
}
