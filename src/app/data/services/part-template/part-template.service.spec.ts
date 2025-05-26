import { TestBed } from '@angular/core/testing';
import { TemplateService } from './part-template.service';

describe('PartTemplateService', () => {
  let service: TemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
