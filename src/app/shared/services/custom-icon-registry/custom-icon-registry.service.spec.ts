import { TestBed } from '@angular/core/testing';

import { CustomIconRegistryService } from './custom-icon-registry.service';

describe('CustomIconRegistryService', () => {
  let service: CustomIconRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomIconRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
