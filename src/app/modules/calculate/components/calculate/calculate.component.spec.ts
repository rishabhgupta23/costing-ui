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
import { Part } from '../../../../data/models/part';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CostItem } from '../../../../data/models/cost-calculator';
import { FormGroup, FormControl } from '@angular/forms';

fdescribe('CalculateComponent', () => {
  let component: CalculateComponent;
  let fixture: ComponentFixture<CalculateComponent>;
  let mockPartService: jasmine.SpyObj<PartService>;
  let mockCostCalculatorService: jasmine.SpyObj<CostCalculatorService>;

  const mockPartList = [
    { partId: 1, partName: 'Bolt', partNumber: 'B123' },
    { partId: 2, partName: 'Nut', partNumber: 'N456' }
  ];

  const mockCostResponse = {
    costCalcDtoList: [{
      partName: 'Washer',
      partNumber: 'W123',
      quantity: 1,
      subTotal: 50,
      vendorName: 'TestVendor',
      rate: 50,

    }] as unknown as CostItem[],
    totalCost: 50
  };
  
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 it('should apply filters correctly and emit searchSubject', () => {
    spyOn(component['searchSubject'], 'next');
    component.applyFilter({ key: 'partName', value: 'Bolt' });
    expect(component.filterCriteria.get('partName')).toBe('Bolt');
    expect(component.filterCriteria.size).toBe(1);
    expect(component['searchSubject'].next).toHaveBeenCalledWith({ key: 'partName', value: 'Bolt' });
  });

  it('should calculate cost when valid form is submitted', () => {
    component.calculateform.setValue({
      part: mockPartList[0],
      pricing: PricingOptions.MIN.value
    } as any);
    
    mockCostCalculatorService.getCost.and.returnValue(of(mockCostResponse));

    component.getCost();

    expect(mockCostCalculatorService.getCost).toHaveBeenCalledWith(1, PricingOptions.MIN.value);
   
  expect(component.costingList[0]).toEqual(jasmine.objectContaining({
    partName: 'Washer',
    partNumber: 'W123',
    quantity: 1,
    subTotal: 50,
    vendorName: 'TestVendor',
    rate: 50
  }));
  
    
    
expect(component.totalQP).toBe(50);
expect(component.isCalculated).toBeTrue();

  });

  it('should set selected part in the form when onPartSelected is called', () => {
    const selectedPart = mockPartList[0]; // Using Bolt from mockPartList
  
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

  it('should filter parts from mockPartList based on input value', fakeAsync(() => {
    const mockResponse = {
      data: {
        partsList: mockPartList
      }
    };
  
    mockPartService.getPartList.and.returnValue(of(mockResponse));
  
    component.ngOnInit();
    fixture.detectChanges();
  
    let filteredResults: any[] = [];
    component.filteredParts!.subscribe(results => filteredResults = results);
  
  
    component.partControl.setValue('Nut');
    tick(300); // allow debounceTime to pass
    fixture.detectChanges();
  
    expect(filteredResults).toEqual([
      { partId: 2, partName: 'Nut', partNumber: 'N456' }
    ]);
  }));
  

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

  it('should return empty string from displayFn if input is null', () => {
    const name = component.displayFn(null);
    expect(name).toBe('');
  });
});
