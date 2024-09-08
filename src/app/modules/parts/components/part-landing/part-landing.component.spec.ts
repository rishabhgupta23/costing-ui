import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartLandingComponent } from './part-landing.component';

describe('PartLandingComponent', () => {
  let component: PartLandingComponent;
  let fixture: ComponentFixture<PartLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartLandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
