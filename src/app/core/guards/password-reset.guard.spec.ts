import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { passwordResetGuard } from './password-reset.guard';

describe('passwordResetGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => passwordResetGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
