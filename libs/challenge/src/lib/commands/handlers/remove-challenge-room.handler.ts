import { MessageTypes, RemoveChallengeRoom } from '@code-battle/common';
import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { SQS } from 'aws-sdk';
import { ChallengeRoomService } from '../../challenge-room.service';
import { ChallengeRoomsGateway } from '../../gateways/challenge-room.gateway';

@Injectable()
export class RemoveChallengeRoomHandler {
  constructor(
    private readonly challengeRoomService: ChallengeRoomService,
    private readonly challengeRoomGateway: ChallengeRoomsGateway
  ) {}
  // TODO remove hardcode
  @SqsMessageHandler('INACTIVE_CHALLENGE_ROOM_QUEUE', false)
  public async challengeRooms(message: SQS.Message) {
    const messageBody: RemoveChallengeRoom = JSON.parse(message.Body);

    await this.challengeRoomService.removeChallengeRoom(messageBody.roomId);

    this.challengeRoomGateway.server.emit(MessageTypes.RemoveChallengeRoom, {
      roomId: messageBody.roomId,
    });
  }
}
