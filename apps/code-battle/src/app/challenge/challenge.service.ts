import { Injectable } from '@angular/core';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable({ providedIn: 'root' })
export class ChallengeService {
  constructor(private readonly webSocketService: WebsocketService) {}

  public testCode(roomId: string, code: string) {
    this.webSocketService.emit('codeTest', [roomId, code]);
  }

  public getTestResults() {
    // TODO Should be a HTTP Call
    return this.webSocketService.fromEvent('testResults');
  }

  public getChallenge() {
    return this.webSocketService.fromEvent('challenge');
  }

  public getGameResult() {
    return this.webSocketService.fromEvent('gameResult');
  }
}
