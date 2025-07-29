import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthUtil } from 'src/app/shared/utils/auth.util';

export const passwordResetGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (AuthUtil.resetRequired) {
    return router.parseUrl('/change-password');
  }

  return true;
};
