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

  public async handleConnection(client: Socket): Promise<void> {
    try {
      const user = await this.webSocketService.getUserFromWebsocket(client);
      console.log('User: ', user.id, ' is connected');

      await this.cacheManager.set(user.id + '', client.id);

      return void 0;
    } catch (error) {
      if (error instanceof WsException) {
        client.emit(MessageTypes.Unauthorized, {
          status: 403,
          error: 'Not Authorized',
        });
      }
    }
  }

  public async handleDisconnect(client: Socket): Promise<void> {
    try {
      const user = await this.webSocketService.getUserFromWebsocket(client);
      await this.cacheManager.del(user.id + '');

      const challenge = await this.challengeService.getChallengeByUser(
        +user.id
      );
      // TODO make game over
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
  @SubscribeMessage(MessageTypes.Reconnect)
  public async handleReconnect(@ConnectedSocket() client: Socket) {
    const user = await this.webSocketService.getUserFromWebsocket(client);

    await this.cacheManager.set(user.id + '', client.id);
  }

  @UseFilters(new WSExceptionsFilter())
  @SubscribeMessage(MessageTypes.JoinChallenge)
  public async handleJoinChallenge(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket
  ) {
    await this.webSocketService.getUserFromWebsocket(client);

    const challenge = await this.challengeService.getChallengeByRoomId(
      data.roomId
    );

    if (!challenge) {
      throw new WsException('Cannot find room');
    }

    const joinedPlayers = challenge.players.map((player) => player.id);

    const currentPlayerSocketIds = await Promise.all(
      joinedPlayers.map((id) => this.cacheManager.get<string>(id + ''))
    );

    if (this.challengeService.isMaxPlayersReached(joinedPlayers.length)) {
      this.server.emit(MessageTypes.RemoveChallengeRoom, {
        roomId: data.roomId,
      });

      for (const socketId of currentPlayerSocketIds) {
        this.server.to(socketId).emit(MessageTypes.StartChallenge);
      }
    }
  }
}
