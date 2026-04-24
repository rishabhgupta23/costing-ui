import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgressDialogComponent } from './progress-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProgressDialogComponent', () => {
  let component: ProgressDialogComponent;
  let fixture: ComponentFixture<ProgressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressDialogComponent, BrowserAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { step: 0 } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the provided step', () => {
    expect(component.data.step).toBe(0);
  });

  it('should update step data', () => {
    component.data.step = 1;
    expect(component.data.step).toBe(1);
  });
});
