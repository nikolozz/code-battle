import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable()
export class WebsocketService {
  constructor(private readonly socket: Socket) {}

  // Todo import data type from lib
  public emit(subject: 'codeTest', data: string[]): void;
  public emit(
    subject: 'acceptChallenge' | 'startChallenge',
    data: string
  ): void;
  public emit(subject: string, data: string[] | string): void {
    this.socket.emit(subject, data);
  }

  public fromEvent(event: string): Observable<unknown> {
    return this.socket.fromEvent(event);
  }
}
