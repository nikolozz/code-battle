import { Injectable } from '@angular/core';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  public isChallengeStarted?: boolean;

  constructor(private readonly webSocketService: WebsocketService) { }

  public startChallenge() {
    this.webSocketService.emit('startChallenge', 'empty');
  }

  public getInvite() {
    return this.webSocketService.fromEvent('challengeInvite');
  }

  public acceptChallenge(room: string) {
    this.webSocketService.emit('acceptChallenge', room);
  }

  public challengeStarted() {
    this.isChallengeStarted = true;
    return this.webSocketService.fromEvent('challengeStarted');
  }
}
