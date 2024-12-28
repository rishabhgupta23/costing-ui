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
    if(token && this.isTokenValid()) {
      req = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
    } else {
      AuthUtil.resetToken();
      this.router.navigateByUrl("/login");
    }

    return next.handle(req);
  }

  isTokenValid() {
    const token = AuthUtil.accessToken;
    const tokenJwtParts: string[] = token.split('.');
    const payload = JSON.parse(atob(tokenJwtParts[1]));
    if(payload?.exp) {
      const exp = new Date(0);
      exp.setUTCSeconds(payload.exp);
      const cur = new Date();
      return cur.getTime() < exp.getTime();
    } else {
      return false;
    }
  }
}