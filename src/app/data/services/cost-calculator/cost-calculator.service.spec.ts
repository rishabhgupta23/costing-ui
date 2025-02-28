import { TestBed } from '@angular/core/testing';

import { CostCalculatorService } from './cost-calculator.service';

describe('CostCalculatorService', () => {
  let service: CostCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
