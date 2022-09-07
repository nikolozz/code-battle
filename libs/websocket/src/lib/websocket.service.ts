import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '@code-battle/auth';
import { parse } from 'cookie';
import { Socket } from 'socket.io';

@Injectable()
export class WebSocketService {
  constructor(private readonly authService: AuthService) {}

  public async getUserFromWebsocket(socket: Socket) {
    const cookie = socket.handshake.headers?.cookie;

    if (!cookie) {
      throw new WsException('Invalid Credentials.');
    }

    const { Authentication: token } = parse(cookie);
    const user = await this.authService.getAuthorizedUserFromToken(token);

    if (!user) {
      throw new WsException('Invalid Credentials.');
    }

    return user;
  }
}
