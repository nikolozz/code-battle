import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '@code-battle/auth';
import { parse } from 'cookie';
import { Socket } from 'socket.io';
import { DBUser } from '@code-battle/user';

@Injectable()
export class WebSocketService {
  constructor(private readonly authService: AuthService) {}

  public async getUserFromWebsocket(socket: Socket): Promise<DBUser> {
    const cookie = socket.handshake.headers?.cookie;

    if (!cookie) {
      throw new WsException('Auth header is missing.');
    }

    const { Authentication: token } = parse(cookie);

    if (!token) {
      throw new WsException('Token is missing.');
    }

    const user = await this.authService.getAuthorizedUserFromToken(token);

    if (!user) {
      throw new WsException('Invalid token.');
    }

    return user;
  }
}
