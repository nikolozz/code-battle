import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

// TODO move interceptor, auth service, models to data-access library
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (req.url.indexOf('/refresh-token') > -1) {
      return next.handle(req);
    }

    const modifiedRequest = req.clone({
      withCredentials: true,
    });

    return next.handle(modifiedRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              return next.handle(req);
            }),
            catchError((err) => {
              localStorage.removeItem('user');

              this.router.navigate(['../login']);

              return throwError(() => err);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
