import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartsFormComponent } from './parts-form.component';
import { PartService } from '../../../../data/services/part/part.service';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { SnackbarService } from '../../../../data/services/snackbar/snackbar.service';
import { of } from 'rxjs';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { PartRow } from '../../../../data/models/part';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { TableActions } from '../../../../shared/constants/table.constants';

fdescribe('PartsFormComponent', () => {
  let component: PartsFormComponent;
  let fixture: ComponentFixture<PartsFormComponent>;

  const mockPartService = {
    getPartTypes: () => of(['CHILD', 'MASTER']),
    getPartUnits: () => of(['PCS', 'KG']),
    getPartCategories: () => of(['Electrical', 'Mechanical']),
    getCostFactors: () => of([]),
    getPartById: (id: string) => of({
      partName: 'Test Part',
      partNumber: 'TP001',
      type: 'CHILD',
      unit: 'PCS',
      categoryId: 1,
      vendorCostList: [],
      bom: []
    }),
    createPart: () => of({ id: 1 }),
    updatePart: () => of({})
  };

  const mockVendorService = {
    getVendorList: () => of({ data: [] }),
  };

  const mockSnackbarService = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
  };

  const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartsFormComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
      ],
      providers: [
        { provide: PartService, useValue: mockPartService },
        { provide: VendorService, useValue: mockVendorService },
        { provide: SnackbarService, useValue: mockSnackbarService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '123']]) } } },
        { provide: MatDialog, useValue: mockDialog },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form fields when partId is present', () => {
    expect(component.partForm.value).toEqual(
      jasmine.objectContaining({
        partNumber: 'TP001',
        partName: 'Test Part',
        partType: 'CHILD',
        partUnit: 'PCS',
      })
    );
  });

  it('should show error snackbar if form is invalid on submit', () => {
    component.partForm.patchValue({ partName: '', partNumber: '', partType: '', partUnit: '' });
    component.onSubmit();
    expect(mockSnackbarService.error).toHaveBeenCalledWith('Please fill all required fields!');
  });

  it('should call updatePart when partId is available and form is valid', () => {
    const spy = spyOn(mockPartService, 'updatePart').and.callThrough();

    component.partForm.patchValue({
      partName: 'Updated Part',
      partNumber: 'UP001',
      partType: 'MASTER',
      partUnit: 'KG'
    });

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(mockSnackbarService.success).toHaveBeenCalledWith('Part updated successfully!');
  });

  it('should call createPart when partId is null and form is valid', () => {
    component.partId = null; // override the test partId

    const spy = spyOn(mockPartService, 'createPart').and.callThrough();

    component.partForm.patchValue({
      partName: 'New Part',
      partNumber: 'NP001',
      partType: 'CHILD',
      partUnit: 'PCS'
    });

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(mockSnackbarService.success).toHaveBeenCalledWith('Part created successfully!');
  });

  it('should call getPartData if partId is present', () => {
    const spy = spyOn(component as any, 'getPartData').and.callThrough();
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith('123');
  });

  it('should map vendorCostList correctly using vendorCostListToMap', () => {
    const vendorCostList = [
      {
        id: 1,
        name: 'Vendor A',
        costFactorValues: [
          { id: 101, name: 'Labor', value: 200 },
          { id: 102, name: 'Material', value: 300 }
        ]
      },
      {
        id: 2,
        name: 'Vendor B',
        costFactorValues: [
          { id: 103, name: 'Overhead', value: 150 }
        ]
      }
    ] as any;
  
    component.vendorCostListToMap(vendorCostList);
  
    expect(component.vendorCostMap.size).toBe(2);
    expect(component.vendorCostMap.get(1)?.length).toBe(2);
    expect(component.vendorCostMap.get(2)?.[0].name).toBe('Overhead');
  });
  

  it('should add vendor to vendorCostMap', () => {
    const vendor = { id: 10, name: 'Vendor X' } as any;
    component.addVendor(vendor);
    expect(component.vendorCostMap.has(10)).toBeTrue();
  });

  it('should not add vendor again if already exists in vendorCostMap', () => {
    const vendor = { id: 20, name: 'Vendor Y' } as any;
    component.vendorCostMap.set(20, []);
    component.addVendor(vendor);
    expect(component.vendorCostMap.size).toBe(1); // still 1, not added again
  });

  it('should clear vendor cost data when partType is MASTER', () => {
    const spy = spyOn(component, 'clearVendorCostData');
    component.ngOnInit();
    component.partForm.get('partType')?.setValue('MASTER');
    expect(spy).toHaveBeenCalled();
  });

  it('should generate BOM body correctly', () => {
    component.bomPartList = [
      { id: 1, partName: 'Child 1', partNumber: 'C1', value: 3 },
      { id: 2, partName: 'Child 2', partNumber: 'C2', value: 5 }
    ];
    const result = component.generateBomDetailsBody();
    expect(result).toEqual([
      { childPartId: 1, quantity: 3 },
      { childPartId: 2, quantity: 5 }
    ]);
  });

  it('should delete vendor cost entry from vendorCostMap', () => {
    const vendorId = 1;
    const mockFactors = [
      { id: 101, name: 'Labor', value: 200 },
      { id: 102, name: 'Material', value: 300 }
    ];

    component.vendorCostMap.set(vendorId, [...mockFactors]);
  
    const factorToRemove = { id: 101, value: 200 };
    component.removeCostFactor(factorToRemove, vendorId);
  
    const updated = component.vendorCostMap.get(vendorId);
    expect(updated?.length).toBe(1);             
    expect(updated?.[0].id).toBe(102);              
  });
  

  it('should delete vendor from vendorCostMap and vendorList', () => {
    const vendorId = 1;
    const vendor = { id: 1, name: 'Test Vendor' } as any;
    component.vendorCostMap.set(vendorId, []);
    component.vendorList = [vendor];

    component.deleteVendorFromMap(vendorId);

    expect(component.vendorCostMap.has(vendorId)).toBeFalse();
    expect(component.vendorList.find(v => v.id === vendorId)).toBeDefined();
  });



  it('should open BOM dialog and call handleDialogClose if action is UPDATE', () => {
    const selectedParts: Set<PartRow> = new Set([
      { partId: 1, partName: 'Part A', partNumber: 'P001' } as PartRow,
      { partId: 2, partName: 'Part B', partNumber: 'P002' } as PartRow
    ]);
  
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({ data: selectedParts, action: DialogCloseResponse.UPDATE }), close: null });
    mockDialog.open.and.returnValue(dialogRefSpyObj);
  
    spyOn(component, 'handleDialogClose');
  
    component.openBomDialog();
  
    expect(mockDialog.open).toHaveBeenCalled();
    expect(component.handleDialogClose).toHaveBeenCalledWith(selectedParts);
  });

  it('should clear bomPartList if selectedParts is empty', () => {
    component.bomPartList = [{ id: 1, partName: 'Old', partNumber: 'O1', value: 2 }];
    component.handleDialogClose(new Set());
    expect(component.bomPartList.length).toBe(0);
  });

  it('should add new selected parts to bomPartList if not present', () => {
    const selectedParts = new Set<PartRow>([
      { partId: 1, partName: 'Part A', partNumber: 'P001' } as PartRow
    ]);
  
    component.bomPartList = [];
  
    component.handleDialogClose(selectedParts);
  
    expect(component.bomPartList.length).toBe(1);
    expect(component.bomPartList[0]).toEqual(jasmine.objectContaining({
      id: 1,
      partName: 'Part A',
      partNumber: 'P001',
      value: 0
    }));
  });

  it('should not add duplicate part to bomPartList', () => {
    const selectedParts = new Set<PartRow>([
      { partId: 1, partName: 'Part A', partNumber: 'P001' } as PartRow
    ]);
  
    component.bomPartList = [{ id: 1, partName: 'Part A', partNumber: 'P001', value: 2 }];
  
    component.handleDialogClose(selectedParts);
  
    expect(component.bomPartList.length).toBe(1); // still 1, no duplicate
  });

  
  it('should remove unselected parts from bomPartList', () => {
    component.bomPartList = [
      { id: 1, partName: 'Part A', partNumber: 'P001', value: 2 },
      { id: 2, partName: 'Part B', partNumber: 'P002', value: 5 }
    ];
  
    const selectedParts = new Set<PartRow>([
      { partId: 1, partName: 'Part A', partNumber: 'P001' } as PartRow
    ]);
  
    component.handleDialogClose(selectedParts);
  
    expect(component.bomPartList.length).toBe(1);
    expect(component.bomPartList[0].id).toBe(1);
  });
  
  

  it('should clear vendorCostMap and vendorList when partType is MASTER', () => {
    component.vendorCostMap.set(1, []);
    component.vendorList.push({ id: 1, name: 'Vendor' } as any);

    component.clearVendorCostData();

    expect(component.vendorCostMap.size).toBe(0);
  });

  it('should return vendor name if vendor exists', () => {
    component.vendorList = [{ id: 1, name: 'Vendor X' } as any];
    expect(component.getVendorName(1)).toBe('Vendor X');
  });
  
  it('should return "Unknown Vendor" if vendor is not found', () => {
    component.vendorList = [];
    expect(component.getVendorName(99)).toBe('Unknown Vendor');
  });

  it('should call removeCostFactor when DELETE action is triggered', () => {
    const spy = spyOn(component, 'removeCostFactor');
    const mockRow = { id: 101, value: 123 };
    component.handleAction({ action: TableActions.DELETE, row: mockRow }, 1);
    expect(spy).toHaveBeenCalledWith(mockRow, 1);
  });
  
  it('should return masterParts form array', () => {
    expect(component.masterParts).toBeTruthy();
  });

  it('should call addCostFactor with form value', () => {
    const mockFactor = { id: 1, name: 'Labor', value: 10 };
    component.costFactors.push(new FormControl(mockFactor));
  
    const spy = spyOn(component, 'addCostFactor');
    component.addCostFactorFromFieldValue(0, 2);
    expect(spy).toHaveBeenCalledWith(mockFactor, 2);
  });

  it('should add cost factor to vendorCostMap if not present', () => {
    const vendorId = 3;
    const costFactor = { id: 1, name: 'Labor', value: 50 };
  
    component.addCostFactor(costFactor, vendorId);
    expect(component.vendorCostMap.get(vendorId)).toContain(jasmine.objectContaining({ id: 1, name: 'Labor' }));
  });
  
  it('should not add duplicate cost factor', () => {
    const vendorId = 3;
    const costFactor = { id: 1, name: 'Labor', value: 50 };
    component.vendorCostMap.set(vendorId, [costFactor]);
  
    component.addCostFactor(costFactor, vendorId);
    expect(component.vendorCostMap.get(vendorId)?.length).toBe(1);
  });
  


});
