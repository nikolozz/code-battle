import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private API_URL = 'http://localhost:3001/api';

  constructor(private readonly http: HttpClient) {}

  public joinChallenge(roomId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/challenge/${roomId}`);
  }
}
