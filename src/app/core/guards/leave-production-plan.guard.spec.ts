import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { leaveProductionPlanGuard } from './leave-production-plan.guard';

describe('leaveProductionPlanGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => leaveProductionPlanGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
