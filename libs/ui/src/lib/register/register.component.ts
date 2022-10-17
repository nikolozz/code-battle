import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageTypes } from '@code-battle/common';
import { WebsocketService } from '@code-battle/ui/websocket';
import { tap } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'code-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly wsService: WebsocketService
  ) {}

  public isLoading = false;
  public error?: string;

  public onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;

    const user = {
      email: form.value.email,
      password: form.value.password,
      repeatPassword: form.value.repeatPassword,
      username: form.value.username,
    };

    this.authService
      .signUp(user)
      .pipe(
        tap(() => {
          this.wsService.emit(MessageTypes.Reconnect, '');
        })
      )
      .subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate(['../home']);
        },
        (error) => {
          // Todo Improve error handling
          this.error = error?.error?.message || 'Unexpected Error Occurred';
          this.isLoading = false;
        }
      );
  }
}
