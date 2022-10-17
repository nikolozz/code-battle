import { Injectable } from '@angular/core';
import {
  DashboardChallengeRoom,
  RemoveChallengeRoom,
  MessageTypes,
} from '@code-battle/common';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  constructor(private readonly socket: Socket) {}

  public emit(
    subject: MessageTypes.CreateChallengeRoom,
    data: DashboardChallengeRoom
  ): void;
  public emit(
    subject: MessageTypes.RemoveChallengeRoom,
    data: RemoveChallengeRoom
  ): void;
  public emit(
    subject: MessageTypes.JoinChallenge,
    data: { roomId: string }
  ): void;
  public emit(subject: MessageTypes.Reconnect): void;
  public emit(subject: string, data: string): void;
  public emit(
    subject: string | MessageTypes,
    data?: string | DashboardChallengeRoom | RemoveChallengeRoom | undefined
  ): void {
    this.socket.emit(subject, data);
  }

  public fromEvent<T>(event: string): Observable<T> {
    return this.socket.fromEvent(event);
  }
}
