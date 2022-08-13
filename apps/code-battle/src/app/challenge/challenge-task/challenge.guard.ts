import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeService } from '../../home/home.service';

@Injectable({
  providedIn: 'root',
})
export class ChallengeGuard implements CanActivate {
  constructor(
    private readonly homeService: HomeService,
    private readonly router: Router
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.homeService.isChallengeStarted) {
      return true;
    }
    return this.router.navigate(['../home']);
  }
}
