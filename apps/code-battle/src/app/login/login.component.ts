// Todo merge register/login components
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@code-battle/ui';

@Component({
  selector: 'code-auth',
  templateUrl: './login.component.html',
  styles: ['.form-group { padding-top: 1rem}'],
})
export class LoginComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
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

    this.authService.signIn(signInData).subscribe(
      () => {
        this.router.navigate(['../home']);
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.error = error?.error?.message || 'Unexpected Error Occurred';
        this.isLoading = true;
      }
    );
  }
}