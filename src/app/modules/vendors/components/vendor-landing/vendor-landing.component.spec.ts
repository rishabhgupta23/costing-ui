import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorLandingComponent } from './vendor-landing.component';

describe('VendorLandingComponent', () => {
  let component: VendorLandingComponent;
  let fixture: ComponentFixture<VendorLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorLandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
