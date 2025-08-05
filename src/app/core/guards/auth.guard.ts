import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthUtil } from 'src/app/shared/utils/auth.util';
import { UserRole } from 'src/app/shared/constants/userrole.constants';
import { UserService } from 'src/app/data/services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userserive:UserService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token || !AuthUtil.isTokenValid()) {
      this.router.navigate(['/login']);
      return false;
    }
    const allowedRoles = route.data['roles'] as UserRole[] | undefined;
    const userRole = this.userserive.getCurrentUser()?.roleName as UserRole;
    if (AuthUtil.hasRole(userRole, allowedRoles)) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}