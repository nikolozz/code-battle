import { CacheClient, CACHE_PROVIDER } from '@code-battle/cache';
import { ChallengeService } from '@code-battle/challenge';
import { DashboardChallengeRoom, MessageTypes } from '@code-battle/common';
import { WebSocketService } from '@code-battle/websocket';
import { Inject, UseFilters } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WSExceptionsFilter } from '../filters';

@WebSocketGateway(4445, {
  cors: { origin: 'http://localhost:4200', credentials: true },
})
export class ChallengeRoomsGateway {
  @WebSocketServer()
  public server: Server;

  constructor(
    private readonly webSocketService: WebSocketService,
    private readonly challengeService: ChallengeService,
    @Inject(CACHE_PROVIDER)
    private readonly cacheManager: CacheClient
  ) {}

  @UseFilters(new WSExceptionsFilter())
  @SubscribeMessage(MessageTypes.CreateChallengeRoom)
  public async handleCreateChallengeRoom(
    @MessageBody() data: DashboardChallengeRoom,
    @ConnectedSocket() client: Socket
  ) {
    await this.webSocketService.getUserFromWebsocket(client);

    client.broadcast.emit(MessageTypes.ChallengeRoomCreated, data);
  }

  public async handleDisconnect(client: Socket): Promise<void> {
    try {
      const user = await this.webSocketService.getUserFromWebsocket(client);

      const challenge = await this.challengeService.getChallengeByUser(
        +user.id
      );

      if (challenge) {
        console.log(`User ${user.id} left the challenge`);
      }
      return void 0;
    } catch (error) {
      if (error instanceof WsException) {
        client.send({ status: 403, error: 'Not Authorized' });
      }
    }
  }

  @UseFilters(new WSExceptionsFilter())
  @SubscribeMessage(MessageTypes.JoinChallenge)
  public async handleJoinChallenge(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket
  ) {
    await this.webSocketService.getUserFromWebsocket(client);

    const room = await this.challengeService.getChallengeByRoomId(data.roomId);

    if (!room) {
      throw new WsException('Cannot find room');
    }

    const cachedRoom = await this.cacheManager.get<string[]>(data.roomId);

    if (!cachedRoom) {
      await this.cacheManager.set(data.roomId, [
        ...(cachedRoom || []),
        client.id,
      ]);
    }

    const connectedSockets = await this.cacheManager.get<string[]>(data.roomId);

    if (this.challengeService.isMaxPlayersReached(connectedSockets?.length)) {
      throw new WsException('Room is full');
    }

    client.join(data.roomId);
    await this.cacheManager.set(data.roomId, [
      ...(cachedRoom || []),
      client.id,
    ]);

    const currentPlayers = await this.cacheManager.get<string[]>(data.roomId);
    if (this.challengeService.isMaxPlayersReached(currentPlayers.length)) {
      return this.server.to(data.roomId).emit(MessageTypes.StartChallenge);
    }
  }
}
