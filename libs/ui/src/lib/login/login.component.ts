import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageTypes } from '@code-battle/common';
import { WebsocketService } from '@code-battle/ui/websocket';
import { catchError, tap, throwError } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'code-auth',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly wsService: WebsocketService
  ) {}

  public error?: string;
  public isLoading = false;

  public onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;

    const signInData = {
      email: form.value.email,
      password: form.value.password,
    };

    this.authService
      .signIn(signInData)
      .pipe(
        catchError((error) => {
          this.error = error?.error?.message || 'Unexpected Error Occurred';
          this.isLoading = false;

          return throwError(() => error);
        }),
        tap(() => {
          this.wsService.emit(MessageTypes.Reconnect, '');
        })
      )
      .subscribe(() => {
        this.router.navigate(['../home']);
        this.isLoading = false;
      });
  }
}
