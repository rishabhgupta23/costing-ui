import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { LeaveProductionPlanGuard } from './production-plan-exit.guard';

describe('leaveProductionPlanGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => LeaveProductionPlanGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
