import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductionPlanComponent } from './production-plan.component';
import { PartService } from 'src/app/data/services/part/part.service';
import { ProductionPlanService } from 'src/app/data/services/production-plan/production-plan.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatTable } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageEvent } from '@angular/material/paginator';
import { PartRow } from 'src/app/data/models/part';
import { SortIcons } from 'src/app/shared/constants/table.constants';
import { ProductionCostResponse } from 'src/app/data/models/production-plan';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

describe('ProductionPlanComponent', () => {
  let component: ProductionPlanComponent;
  let fixture: ComponentFixture<ProductionPlanComponent>;
  let partServiceSpy: jasmine.SpyObj<PartService>;
  let planServiceSpy: jasmine.SpyObj<ProductionPlanService>;
  let stepperSpy: jasmine.SpyObj<MatStepper>;

  const mockParts: PartRow[] = [
    { partId: 1, partNumber: 'P001', partName: 'Part A', unit: 'pcs', type: 'raw', categoryName: 'Cat1' },
    { partId: 2, partNumber: 'P002', partName: 'Part B', unit: 'pcs', type: 'raw', categoryName: 'Cat2' }
  ];

const mockCostResponse: ProductionCostResponse = {
  totalCost: 500,
  items: [
    {
      quantity: 10,
      rate: 20,
      subTotal: 200,
      vendorName: 'Vendor1',
      partName: 'Part A',
      partNumber: 'P001'
    },
    {
      quantity: 15,
      rate: 20,
      subTotal: 300,
      vendorName: 'Vendor2',
      partName: 'Part B',
      partNumber: 'P002'
    }
  ]
};


  beforeEach(async () => {
    partServiceSpy = jasmine.createSpyObj('PartService', ['getPartList']);
    planServiceSpy = jasmine.createSpyObj('ProductionPlanService', ['calculateProductionCost']);
    stepperSpy = jasmine.createSpyObj('MatStepper', ['next', 'reset']);

    await TestBed.configureTestingModule({
  declarations: [ProductionPlanComponent],
  imports: [
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [
    { provide: PartService, useValue: partServiceSpy },
    { provide: ProductionPlanService, useValue: planServiceSpy }
  ]
}).compileComponents();


    fixture = TestBed.createComponent(ProductionPlanComponent);
    component = fixture.componentInstance;

     component.table2 = jasmine.createSpyObj<MatTable<PartRow>>('MatTable', ['renderRows']);
    partServiceSpy.getPartList.and.returnValue(of({ data: { partsList: mockParts }, pageInfo: { totalRecords: 2 } }));
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load part list on init', () => {
    partServiceSpy.getPartList.calls.reset();
    component.ngOnInit();
    expect(partServiceSpy.getPartList).toHaveBeenCalled();
    expect(component.partList.length).toBe(2);
    expect(component.totalRecords).toBe(2);
  });

  it('should apply filter when form value changes', fakeAsync(() => {
    const spy = spyOn(component, 'getPartList');
    spy.calls.reset();
    component.partSelectionForm.patchValue({ partName: 'Part A' });
    tick(300);
    expect(spy).toHaveBeenCalled();
    expect(component.filterCriteria.get('partName')).toBe('Part A');
  }));

  it('should toggle sort state', () => {
    component.toggleSort('partNumber');
    expect(component.sortState.sortColumn).toBe('partNumber');
    expect([SortIcons.ASC, SortIcons.DESC]).toContain(component.sortState.sortState);
  });

  it('should toggle part selection', () => {
    const part = mockParts[0];
    component.toggleSelection(part, true);
    expect(component.selectedPartIds.has(part.partId)).toBeTrue();
    expect(component.selectedParts.length).toBe(1);
    component.toggleSelection(part, false);
    expect(component.selectedParts.length).toBe(0);
  });

  it('should select and deselect all parts', () => {
    component.selectAll({ checked: true });
    expect(component.selectedParts.length).toBe(2);
    component.selectAll({ checked: false });
    expect(component.selectedParts.length).toBe(0);
  });

  it('should return correct selection states', () => {
    component.toggleSelection(mockParts[0], true);
    expect(component.isSelected(1)).toBeTrue();
    expect(component.isAllSelected()).toBeFalse();
    expect(component.isIndeterminate()).toBeTrue();
  });

  it('should handle page change', () => {
    const spy = spyOn(component, 'getPartList');
    spy.calls.reset();
    component.onPageChange({ pageIndex: 1, pageSize: 50 } as PageEvent);
    expect(component.pageSize).toBe(50);
    expect(component.currentPage).toBe(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should go to next step with selected parts', () => {
    stepperSpy.next.calls.reset();
    component.toggleSelection(mockParts[0], true);
    component.goToNextStep(stepperSpy);
    expect(component.allSelectedParts.length).toBe(1);
    expect(stepperSpy.next).toHaveBeenCalled();

  });

  it('should prepare plan form with quantities', () => {
    component.toggleSelection(mockParts[0], true);
    component.preparePlanForm();
    expect(component.planForm.contains(`quantity_${mockParts[0].partId}`)).toBeTrue();
  });

  it('should call productionPlanService with correct request and set response', () => {
  planServiceSpy.calculateProductionCost.calls.reset();
  planServiceSpy.calculateProductionCost.and.returnValue(of(mockCostResponse));
  component.toggleSelection(mockParts[0], true);
  component.preparePlanForm();
  component.planProduction(stepperSpy);

  expect(planServiceSpy.calculateProductionCost).toHaveBeenCalledWith({
    priceMode: component.planForm.get('pricingMode')?.value,
    parts: [{ partId: 1, quantity: 1 }]
  });
  expect(component.productionCostResponse).toEqual(mockCostResponse);
  expect(stepperSpy.next).toHaveBeenCalled();
});


  it('should handle error in production plan service', () => {
    spyOn(console, 'error');
    planServiceSpy.calculateProductionCost.and.returnValue(throwError(() => 'Error'));
    component.toggleSelection(mockParts[0], true);
    component.preparePlanForm();
    component.planProduction(stepperSpy);
    expect(console.error).toHaveBeenCalledWith('Production plan calculation failed', 'Error');
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should reset plan correctly', () => {
    component.stepper = stepperSpy;
    component.toggleSelection(mockParts[0], true);  
    component.resetPlan();
    expect(component.selectedParts.length).toBe(0);
    expect(component.productionCostResponse).toBeNull();
    expect(component.selectedStepIndex).toBe(0);
    expect(stepperSpy.reset).toHaveBeenCalled();
  });

  it('should compute total quantity and cost', () => {
    component.productionCostResponse = mockCostResponse;
    expect(component.getTotalQuantity()).toBe(25);
    expect(component.getTotalCost()).toBe(500);
  });
});
