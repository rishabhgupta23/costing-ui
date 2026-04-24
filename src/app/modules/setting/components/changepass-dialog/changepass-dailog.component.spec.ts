import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangepassDailogComponent } from './changepass-dailog.component';

describe('ChangepassDailogComponent', () => {
  let component: ChangepassDailogComponent;
  let fixture: ComponentFixture<ChangepassDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangepassDailogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangepassDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
