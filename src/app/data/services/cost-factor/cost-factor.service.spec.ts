import { TestBed } from '@angular/core/testing';

import { CostFactorService } from './cost-factor.service';

describe('CostFactorService', () => {
  let service: CostFactorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostFactorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
