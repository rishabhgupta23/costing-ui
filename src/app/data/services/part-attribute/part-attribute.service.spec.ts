import { TestBed } from '@angular/core/testing';

import { PartAttributeService } from './part-attribute.service';

describe('PartAttributeService', () => {
  let service: PartAttributeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartAttributeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
