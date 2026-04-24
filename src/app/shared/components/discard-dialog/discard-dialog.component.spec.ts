import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscardDialogComponent } from './discard-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

describe('DiscardDialogComponent', () => {
  let component: DiscardDialogComponent;
  let fixture: ComponentFixture<DiscardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscardDialogComponent, HttpClientModule, MatDialogModule],
      providers: [
      { provide: MatDialogRef, useValue: {} },
      { provide: MAT_DIALOG_DATA, useValue: { row: { id: 1 } } }
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
