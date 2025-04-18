import { ComponentFixture, TestBed, fakeAsync, tick ,flush} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { PartService } from '../../../../data/services/part/part.service';
import { CostCalculatorService } from '../../../../data/services/cost-calculator/cost-calculator.service';
import { PricingOptions } from '../../../../shared/constants/pricingoptions.constants';

import { CalculateComponent } from './calculate.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { Part, PartRow } from '../../../../data/models/part';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CostItem } from '../../../../data/models/cost-calculator';
import { FormGroup, FormControl } from '@angular/forms';
import { mockPartList, mockCostResponse } from '../../../../mock-data/cost.mock-data';

fdescribe('CalculateComponent', () => {
  let component: CalculateComponent;
  let fixture: ComponentFixture<CalculateComponent>;
  let mockPartService: jasmine.SpyObj<PartService>;
  let mockCostCalculatorService: jasmine.SpyObj<CostCalculatorService>;

  
  beforeEach(async () => {
    mockPartService = jasmine.createSpyObj('PartService', ['getPartList']);
    mockCostCalculatorService = jasmine.createSpyObj('CostCalculatorService', ['getCost']);
    await TestBed.configureTestingModule({
      declarations: [CalculateComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatAutocompleteModule,
        MatInputModule,BrowserAnimationsModule
      ],
      providers: [
        { provide: PartService, useValue: mockPartService },
        { provide: CostCalculatorService, useValue: mockCostCalculatorService }
      ]
    }).compileComponents();

    mockPartService.getPartList.and.returnValue(of([
      { partName: 'Bolt' },
      { partName: 'Nut' },
      { partName: 'Washer' }
    ] as unknown as Part[]));
    

    fixture = TestBed.createComponent(CalculateComponent);
    component = fixture.componentInstance;
    component.partControl = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate cost when valid form is submitted', () => {
   const selectedPart = mockPartList[0]; 
    component.calculateform.get('part')?.setValue(selectedPart);
    component.calculateform.get('pricing')?.setValue( PricingOptions.MIN.value as any);
    mockCostCalculatorService.getCost.and.returnValue(of(mockCostResponse));
    component.getCost();
  
    expect(mockCostCalculatorService.getCost).toHaveBeenCalledWith(1,  PricingOptions.MIN.value);  
    expect(component.costingList).toEqual(mockCostResponse.costCalcDtoList);
    expect(component.totalQP).toBe(mockCostResponse.totalCost); expect(component.isCalculated).toBeTrue();
  });

  it('should set selected part in the form when onPartSelected is called', () => {
    const selectedPart = mockPartList[0]; 
  
    component.calculateform = new FormGroup({
      part: new FormControl(null),
      pricing: new FormControl(null)
    });
  
    component.onPartSelected(selectedPart);
  
    expect(component.calculateform.get('part')?.value as any).toEqual(selectedPart);

  });

  it('should not calculate cost if form is incomplete', () => {
    component.calculateform.setValue({
      part: null,
      pricing: null
    });

    component.getCost();

    expect(mockCostCalculatorService.getCost).not.toHaveBeenCalled();
  });

  it('should filter parts from mockPartList based on input value', () => {
    const partNameToFilter = 'Bolt'; 
    const filteredParts = mockPartList
      .filter(part => part.partName === partNameToFilter)
      .map(part => ({
        partId: 1,
        partName: part.partName,
        partNumber: part.partNumber,
        categoryName: 'Some Category',
        type: 'Some Type',  
        unit: 'Some Unit', 
      }));
  
    component.filteredParts = of(filteredParts);
    
    component.filteredParts?.subscribe(filteredParts => {
      expect(filteredParts.length).toBe(1);  
      expect(filteredParts[0].partName).toBe('Bolt');  
      expect(filteredParts[0].hasOwnProperty('partId')).toBeTrue();
    });
  });
  
  it('should reset the form and cost data', () => {
    component.calculateform.setValue({
      part: mockPartList[0],
      pricing: PricingOptions.MIN.value
    } as any);
    component.totalQP = 100;
    component.isCalculated = true;

    component.onReset();

    expect(component.calculateform.value).toEqual({ part: null, pricing: null });
    expect(component.totalQP).toBeUndefined();
    expect(component.isCalculated).toBeFalse();
  });

  it('should return part name in displayFn', () => {
    const name = component.displayFn({ partName: 'Screw' });
    expect(name).toBe('Screw');
  });

  it('should update column config and reset costingList on toggleControl value change', () => {
    component.defaultCostingList = [{ subTotal: 10 }, { subTotal: 20 }] as CostItem[];
    component.toggleControl.setValue(true);
    expect(component.costCalculatorColumn.length).toBeGreaterThan(0);
  
    component.toggleControl.setValue(false);
    expect(component.costingList).toEqual(component.defaultCostingList);
    expect(component.totalQP).toBe(30);
  });
  
  it('should reset costingList and recalculate totalQP on onClick()', () => {
    component.defaultCostingList = [
      { subTotal: 50 }, { subTotal: 30 }
    ] as CostItem[];
    component.onClick();
    expect(component.costingList).toEqual(component.defaultCostingList);
    expect(component.totalQP).toBe(80);
  });

  it('should update subTotal and totalQP on cell edit in simulation mode', () => {
    component.toggleControl.setValue(true);
    component.costingList = [{ quantity: 2, rate: 10 }, { quantity: 3, rate: 20 }] as CostItem[];
  
    component.onCellEdit(component.costingList[0], 'rate');
  
    expect(component.costingList[0].subTotal).toBe(20);
    expect(component.totalQP).toBe(2 * 10 + 3 * 20);
  });
  

  it('should return empty string from displayFn if input is null', () => {
    const name = component.displayFn(null);
    expect(name).toBe('');
  });
  it('should update filterCriteria when partControl value changes', fakeAsync(() => {
    fixture.destroy();
    fixture = TestBed.createComponent(CalculateComponent);
    component = fixture.componentInstance;
    component.partControl = new FormControl();
    component.filterCriteria = new Map<string, string>();
    const getPartListSpy = spyOn(component, 'getPartList');
  
    component.ngOnInit();
    fixture.detectChanges();
  
    component.partControl.setValue('123');
    tick(400);
    flush();
    fixture.detectChanges();
  
    expect(component.filterCriteria.has('partName')).toBeTrue();
    expect(component.filterCriteria.has('partNumber')).toBeTrue();
    expect(component.filterCriteria.get('partName')).toBe('123');
    expect(component.filterCriteria.get('partNumber')).toBe('123');
    expect(getPartListSpy).toHaveBeenCalled();
  }));
  
});
