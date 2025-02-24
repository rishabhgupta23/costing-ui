import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDialogComponent } from './infodialog.component';

describe('InfodialogComponent', () => {
  let component: InfoDialogComponent;
  let fixture: ComponentFixture<InfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
