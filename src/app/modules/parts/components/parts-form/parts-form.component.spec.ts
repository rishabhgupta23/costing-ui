import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsFormComponent } from './parts-form.component';

describe('PartsFormComponent', () => {
  let component: PartsFormComponent;
  let fixture: ComponentFixture<PartsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
