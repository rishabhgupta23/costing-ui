import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlanComponent } from './production-plan.component';

describe('ProductionPlanComponent', () => {
  let component: ProductionPlanComponent;
  let fixture: ComponentFixture<ProductionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductionPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});