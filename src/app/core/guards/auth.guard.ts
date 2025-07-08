import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthUtil } from 'src/app/shared/utils/auth.util';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('accessToken');
    if (token && AuthUtil.isTokenValid()) {
      const userRole = AuthUtil.getUserRole();
      
      if (this.isRestrictedRoute(state.url) && !this.hasAccess(userRole, state.url)) {
        // Redirect to a vendor page
        this.router.navigate(['/unauthorized']);
        return false;
      }
      
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  private isRestrictedRoute(url: string): boolean {
    const restrictedPaths = ['config', 'settings', 'users', 
      '/parts/create',
      '/parts/edit',
      '/vendors/create',
      '/vendors/edit'];
    return restrictedPaths.some(path => url.includes(path));
  }

  private hasAccess(role: string, url: string): boolean {
    console.log('User role:', role);
    const allowedRoles = ['Super Admin', 'Admin'];

    if (allowedRoles.includes(role)) {
      return true;
    }

    if (role === 'Maintainer') {
      const restrictedForMaintainer = ['users', 'config'];
      return !restrictedForMaintainer.some(path => url.includes(path));
    }

    return false;
  }
}