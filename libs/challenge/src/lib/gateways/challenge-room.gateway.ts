import { DashboardChallengeRoom, MessageTypes } from '@code-battle/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(4445, { cors: true })
export class ChallengeRoomsGateway {
  @WebSocketServer()
  public server: Server;

  @SubscribeMessage(MessageTypes.CreateChallengeRoom)
  public handleMessage(
    @MessageBody() data: DashboardChallengeRoom,
    @ConnectedSocket() client: Socket
  ) {
    client.broadcast.emit(MessageTypes.ChallengeRoomCreated, data);
  }
}
