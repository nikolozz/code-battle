import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable()
export class WebsocketService {
  constructor(private readonly socket: Socket) { }

  public emit(subject: string, data: any): void {
    this.socket.emit(subject, data);
  }

  public fromEvent(event: string): Observable<unknown> {
    return this.socket.fromEvent(event);
  }
}
