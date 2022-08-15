import { Component, OnInit } from '@angular/core';
import { AuthService } from '@code-battle/ui';

@Component({
  selector: 'code-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public title = 'Code Battle';

  constructor(private readonly authService: AuthService) {}

  public ngOnInit(): void {
    this.authService.authenticate().subscribe((user) => {
      if (user) {
        this.authService.user.next(user);
      }
    });
  }
}
