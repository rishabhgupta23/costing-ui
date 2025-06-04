import { TestBed } from '@angular/core/testing';

import { SnackbarService } from './snackbar.service';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';

describe('SnackbarService', () => {
  let service: SnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SnackbarComponent]
    });
    service = TestBed.inject(SnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
