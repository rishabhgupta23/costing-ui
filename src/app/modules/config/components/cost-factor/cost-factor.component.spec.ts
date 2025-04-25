import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostFactorComponent } from './cost-factor.component';

describe('CostFactorComponent', () => {
  let component: CostFactorComponent;
  let fixture: ComponentFixture<CostFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CostFactorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
