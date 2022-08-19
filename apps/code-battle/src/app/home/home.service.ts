import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChallengeCreate, ChallengeRoom } from '@code-battle/common';
import { Observable } from 'rxjs';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  public isChallengeStarted?: boolean;
  private API_URL = 'http://localhost:3001/api';

  constructor(
    private readonly webSocketService: WebsocketService,
    private readonly http: HttpClient
  ) {}

  public getActiveChallengeRooms(): Observable<ChallengeRoom[]> {
    return this.http.get<ChallengeRoom[]>(`${this.API_URL}/challenge-room`);
  }

  public createRoom(room: ChallengeCreate): Observable<ChallengeRoom> {
    return this.http.post<ChallengeRoom>(
      `${this.API_URL}/challenge-room`,
      room
    );
  }
}
