import { ChallengeService } from '@code-battle/challenge';
import { DashboardChallengeRoom, MessageTypes } from '@code-battle/common';
import { WebSocketService } from '@code-battle/websocket';
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

  private players = new Map<string, string[]>();

  constructor(
    private readonly webSocketService: WebSocketService,
    private readonly challengeService: ChallengeService
  ) {}

  @SubscribeMessage(MessageTypes.CreateChallengeRoom)
  public async handleCreateChallengeRoom(
    @MessageBody() data: DashboardChallengeRoom,
    @ConnectedSocket() client: Socket
  ) {
    // TODO FIX getUserFromWS
    // await this.webSocketService.getUserFromWebsocket(client);

    client.broadcast.emit(MessageTypes.ChallengeRoomCreated, data);
  }

  @SubscribeMessage(MessageTypes.JoinChallenge)
  public async handleJoinChallenge(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket
  ) {
    // TODO FIX getUserFromWS

    // await this.webSocketService.getUserFromWebsocket(client);
    // Move to service

    const players = this.players.get(data.roomId);

    if (this.challengeService.isMaxPlayersReached(players?.length || 0)) {
      this.players.set(data.roomId, [...(players || []), client.id]);

      console.log('Client join: ', client.id, this.players.get(data.roomId));
      client.join(data.roomId);
    }
    if (this.players.get(data.roomId).length === 2) {
      console.log('Start challenge');
      return this.server.to(data.roomId).emit(MessageTypes.StartChallenge);
    }
  }
}
