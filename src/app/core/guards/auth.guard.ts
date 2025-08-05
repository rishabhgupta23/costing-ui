import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthUtil } from 'src/app/shared/utils/auth.util';
import { UserRole } from 'src/app/shared/constants/userrole.constants';
import { UserService } from 'src/app/data/services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService:UserService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const token = localStorage.getItem('accessToken');
    if (!token || !AuthUtil.isTokenValid()) {
      this.router.navigate(['/login']);
      return of(false);
    }

    const allowedRoles = route.data['roles'] as UserRole[] | undefined;
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      return of(this.checkRole(currentUser.roleName as UserRole, allowedRoles));
    }

    return this.userService.whoAmI().pipe(
      map(user => this.checkRole(user.roleName as UserRole, allowedRoles)),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
private checkRole(userRole: UserRole, allowed?: UserRole[]) {
  const isAllowed = AuthUtil.hasRole(userRole, allowed);
  if (!isAllowed) {
    this.router.navigate(['/unauthorized']);
  }
  return isAllowed;
}

}
