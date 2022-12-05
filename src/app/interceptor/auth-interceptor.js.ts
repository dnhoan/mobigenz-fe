import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { TokenService } from '../service/token.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token!: string;
  constructor(private router: Router, private tokenService: TokenService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      this.tokenService.getToken() != null &&
      req.url.includes(`${environment.baseUrl}`)
    ) {
      const tokenInfo = this.tokenService.getToken();
      const tokenizedReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + tokenInfo),
      });
      return next.handle(tokenizedReq).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
          }
          return event;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error['status'] === 403) {
            this.tokenService.removeToken();
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }
    return next.handle(req);
  }
}
