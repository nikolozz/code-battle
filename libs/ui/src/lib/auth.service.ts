import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserSignUp, BaseUser } from '@code-battle/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'http://localhost:3001/api';

  public user = new BehaviorSubject<BaseUser | null>(null);

  constructor(private readonly http: HttpClient) {}

  public authenticate(): Observable<BaseUser> {
    return this.http.get<BaseUser>(`${this.API_URL}/authenticate`);
  }

  public signUp(user: UserSignUp): Observable<BaseUser> {
    return this.http
      .post<BaseUser>(`${this.API_URL}/register`, user, {
        withCredentials: true,
      })
      .pipe(tap(this.emitUser.bind(this)));
  }

  public signIn(signInData: {
    email: string;
    password: string;
  }): Observable<BaseUser> {
    return this.http
      .post<BaseUser>(`${this.API_URL}/login`, signInData, {
        withCredentials: true,
      })
      .pipe(tap(this.emitUser.bind(this)));
  }

  public refreshToken(): Observable<BaseUser> {
    return this.http.get<BaseUser>(`${this.API_URL}/refresh-token`, {
      withCredentials: true,
    });
  }

  public logout(): Observable<string> {
    return this.http.get(`${this.API_URL}/logout`, { responseType: 'text' });
  }

  public loadUserFromLocalStorage() {
    if (this.user) {
      const user = localStorage.getItem('user');
      if (user) {
        const currentUser = JSON.parse(user);
        this.user.next(currentUser);
      }
    }
    return this.user.value;
  }

  private emitUser(user: BaseUser) {
    localStorage.setItem('user', JSON.stringify(user));

    this.user.next(user);
  }
}
