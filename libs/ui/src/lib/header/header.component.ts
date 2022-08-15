import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@code-battle/api-types';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'code-header',
  templateUrl: './header.component.html',
  styles: ['a:link {text-decoration: none; padding: 0 10px}'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public user?: Omit<User, 'password'>;

  private userSub?: Subscription;
  private logoutSub?: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  public ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.logoutSub?.unsubscribe();
  }

  public onLogout() {
    this.logoutSub = this.authService.logout().subscribe(() => {
      localStorage.removeItem('user');
      this.authService.user.next(null);
      this.router.navigate(['../sing-in']);
    });
  }
}
