import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostFactorTableComponent } from './cost-factor-table.component';

describe('CostFactorTableComponent', () => {
  let component: CostFactorTableComponent;
  let fixture: ComponentFixture<CostFactorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CostFactorTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostFactorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
