import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthUtil } from '../../../shared/utils/auth.util';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
    const token = AuthUtil.accessToken;
    console.log('Interceptor');
    if(token && AuthUtil.isTokenValid()) {
      req = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
    } else {
      AuthUtil.resetToken();
      this.router.navigate(['/login'], { queryParams: { reason: 'tokenExpired' } });

    }

    return next.handle(req);
  }
}