import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserSignUp, User } from '@code-battle/api-types';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'http://localhost:3001/api';

  public user = new BehaviorSubject<User | null>(null);

  constructor(private readonly http: HttpClient) {}

  public authenticate(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/authenticate`);
  }

  public signUp(user: UserSignUp): Observable<User> {
    return this.http
      .post<User>(`${this.API_URL}/register`, user)
      .pipe(tap(this.emitUser.bind(this)));
  }

  public signIn(signInData: {
    email: string;
    password: string;
  }): Observable<User> {
    return this.http
      .post<User>(`${this.API_URL}/login`, signInData, {
        withCredentials: true,
      })
      .pipe(tap(this.emitUser.bind(this)));
  }

  public refreshToken(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/refresh-token`, {
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

  private emitUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));

    this.user.next(user);
  }
}
