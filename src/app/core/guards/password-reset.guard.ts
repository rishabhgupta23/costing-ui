import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthUtil } from 'src/app/shared/utils/auth.util';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (AuthUtil.resetRequired) {
      return this.router.parseUrl('/change-password');
    }
    return true;
  }
}
