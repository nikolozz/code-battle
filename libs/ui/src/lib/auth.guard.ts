import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    // TODO Fix if page was closed user is lost from localStorage
    const user = localStorage.getItem('user');

    return !!user;
  }
}
