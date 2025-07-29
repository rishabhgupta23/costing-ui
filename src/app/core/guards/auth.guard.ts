import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthUtil } from 'src/app/shared/utils/auth.util';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (AuthUtil.accessToken && AuthUtil.isTokenValid()) {
      return true;
    } else {
      AuthUtil.resetToken();
      return this.router.parseUrl('/login');
    }
  }
}
