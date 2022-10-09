import { Injectable } from '@angular/core';
import { MessageTypes } from '@code-battle/common';
import { WebsocketService } from '@code-battle/ui/websocket';

@Injectable({ providedIn: 'root' })
export class ChallengeService {
  constructor(private readonly webSocketService: WebsocketService) {}

  public testCode(roomId: string, code: string) {
    this.webSocketService.emit('codeTest', roomId);
  }

  public joinChallenge(roomId: string) {
    this.webSocketService.emit(MessageTypes.JoinChallenge, { roomId });
  }

  public startChallenge() {
    return this.webSocketService.fromEvent(MessageTypes.StartChallenge);
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
