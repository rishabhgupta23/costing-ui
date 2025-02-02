import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BomdialogComponent } from './bomdialog.component';

describe('BomdialogComponent', () => {
  let component: BomdialogComponent;
  let fixture: ComponentFixture<BomdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BomdialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BomdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
