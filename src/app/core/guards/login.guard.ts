import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthUtil } from 'src/app/shared/utils/auth.util';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    const token = AuthUtil.accessToken;
    if (token && AuthUtil.isTokenValid()) {
      if (!AuthUtil.resetRequired) {
        this.router.navigate(['/app']);
        return false;
      }
      return true;
    }
    return true;
  }
}
