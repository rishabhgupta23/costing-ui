import { TestBed } from '@angular/core/testing';

import { ProductionPlanService } from './production-plan.service';

describe('ProductionPlanService', () => {
  let service: ProductionPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
