import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PartsFormComponent } from './parts-form.component';
import { PartService } from '../../../../data/services/part/part.service';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { SnackbarService } from '../../../../data/services/snackbar/snackbar.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Part, PartCreateRequest, PartRow } from '../../../../data/models/part';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { TableActions } from '../../../../shared/constants/table.constants';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MOCK_SINGLE_PART } from 'src/app/mock-data/part.mock-data';
import * as fileUtils from 'src/app/shared/utils/file-download.util';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';


describe('PartsFormComponent', () => {
  let component: PartsFormComponent;
  let fixture: ComponentFixture<PartsFormComponent>;
  let partService: jasmine.SpyObj<PartService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  // const partService = {
  //   getPartTypes: () => of(['CHILD', 'MASTER']),
  //   getPartUnits: () => of(['PCS', 'KG']),
  //   getPartCategories: () => of([
  //     { categoryId: 1, categoryName: 'Electronics' },
  //     { categoryId: 2, categoryName: 'Mechanical' }
  //   ]),
  //   getCostFactors: () => of([]),
  //   getPartById: (id: string) => of({
  //     partName: 'Test Part',
  //     partNumber: 'TP001',
  //     type: 'CHILD',
  //     unit: 'PCS',
  //     categoryId: 1,
  //     vendorCostList: [],
  //     bom: []
  //   }),
  //   createPart: () => of({ id: 1 }),
  //   updatePart: () => of({}),
  //   getPartFiles: () => of([]),
  //   uploadPartImage: () => of({}),
  // };

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
      getPartFiles: jasmine.createSpy('getPartFiles').and.returnValue(of([
    'https://example.com/file1.png',
    'https://example.com/file2.pdf'
  ])),
  downloadPartFile: jasmine.createSpy('downloadPartFile').and.returnValue(of({
    fileData: 'base64EncodedString'
  })),
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

  // const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

  beforeEach(async () => {
    const partServiceSpy = jasmine.createSpyObj('PartService', ['createPart', 'uploadPartImage', 'getPartTypes',
       'getPartUnits', 'getPartCategories', 'getCostFactors', 'getPartById', 'updatePart', 'deletePart', 'getPartFiles']);
    const snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['success', 'error']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'close']);
    await TestBed.configureTestingModule({
      declarations: [PartsFormComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        HttpClientTestingModule,
        MatStepperModule,
        MatIconModule
      ],
      providers: [
        { provide: PartService, useValue: partServiceSpy },
        { provide: VendorService, useValue: mockVendorService },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '123']]) } } },
        { provide: MatDialog, useValue: dialogSpy },
      ]
    }).compileComponents();
    partService = TestBed.inject(PartService) as jasmine.SpyObj<PartService>;
    partService.getPartTypes.and.returnValue(of(['CHILD', 'MASTER']));
    partService.getPartUnits.and.returnValue(of(['PCS', 'KG']));
    partService.getPartCategories.and.returnValue(of([
      { categoryId: 1, categoryName: 'Electronics' },
      { categoryId: 2, categoryName: 'Mechanical' }
    ]));
    partService.getPartById.and.returnValue(of(MOCK_SINGLE_PART));
    partService.createPart.and.returnValue(of(MOCK_SINGLE_PART));
    partService.getPartFiles.and.returnValue(of([]));
    partService.uploadPartImage.and.returnValue(of({}));
    partService.updatePart.and.returnValue(of({} as PartCreateRequest));
    snackbarService = TestBed.inject(SnackbarService) as jasmine.SpyObj<SnackbarService>;
    snackbarService.success.and.callFake((msg: string) => console.log('Success:', msg));
    snackbarService.error.and.callFake((msg: string) => console.error('Error:', msg));
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    mockDialog.open.and.returnValue({
      afterClosed: () => of({ data: new Set<PartRow>(), action: DialogCloseResponse.UPDATE }),
      componentInstance: { data: { step: 0 } },
      close: jasmine.createSpy('close') 
    } as any);
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
        partName: 'Test Part',
        partType: 'CHILD',
        partUnit: 'PCS',
      })
    );
  });

  it('should show error snackbar if form is invalid on submit', () => {
    component.partForm.patchValue({ partName: '', partNumber: '', partType: '', partUnit: '' });
    component.onSubmit();
    expect(snackbarService.error).toHaveBeenCalledWith('Please fill all required fields!');
  });

  it('should call updatePart when partId is available and form is valid', () => {
    const spy = spyOn(partService, 'updatePart').and.callThrough();

    component.partForm.patchValue({
      partName: 'Updated Part',
      partNumber: 'UP001',
      partType: 'MASTER',
      partUnit: 'KG'
    });

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(snackbarService.success).toHaveBeenCalledWith('Part updated successfully!');
  });

  it('should upload files after part creation and show success', fakeAsync(() => {
  component.partId = null;
  const dialogRef = { close: jasmine.createSpy('close'), componentInstance: { data: { step: 0 } } };
  spyOn(component as any, 'openProgressDialogIfNeeded').and.returnValue(dialogRef);

  const file = new File(['dummy'], 'test.png', { type: 'image/png' });
  component.selectedFiles = [file];


  spyOn(component['partService'], 'createPart').and.returnValue(of(MOCK_SINGLE_PART));
  spyOn(component['partService'], 'uploadPartImage').and.returnValue(of({}));

  spyOn(component as any, 'handleDialogStep').and.callThrough();
  spyOn(component['router'], 'navigateByUrl').and.stub();

  component.partForm.patchValue({
    partName: 'New Part',
    partNumber: 'NP001',
    partType: 'CHILD',
    partUnit: 'PCS'
  });

  component.onSubmit();

  tick();

  expect((component as any).handleDialogStep).toHaveBeenCalledWith(dialogRef, 1);
  expect((component as any).handleDialogStep).toHaveBeenCalledWith(dialogRef, 2);
  expect(dialogRef.close).toHaveBeenCalled();
  expect(component['snackbarService'].success).toHaveBeenCalledWith('Part created successfully!');
  expect(component['router'].navigateByUrl).toHaveBeenCalledWith('/app/parts');
}));

fit('should show error if file upload fails after part creation', fakeAsync(() => {
  const file = new File(['dummy'], 'test.png', { type: 'image/png' });
  component.selectedFiles = [file];
  component.partId = null;

  spyOn(fileUtils, 'fileToBase64').and.returnValue(Promise.resolve('base64string'));
  (fileUtils as any).fileToBase64 = () => Promise.resolve('base64string');
  partService.createPart.and.returnValue(of(MOCK_SINGLE_PART));
  partService.uploadPartImage.and.returnValue(throwError(() => new Error('fail')));
    partService.updatePart.and.returnValue(of({} as PartCreateRequest));
  // spyOn(component['snackbarService'], 'error');
  spyOn(component['router'], 'navigateByUrl').and.stub();
  spyOn(console, 'error');

  component.partForm.patchValue({
    partName: 'New Part',
    partNumber: 'NP001',
    partType: 'CHILD',
    partUnit: 'PCS'
  });

  component.onSubmit();
  tick(); // run observable + upload + error
  tick(1500); // for dialogRef.close()
  tick();

  // expect(mockDialog.).toHaveBeenCalled();
  expect(snackbarService.error).toHaveBeenCalledWith('Failed to upload part or files.');
  expect(component['router'].navigateByUrl).not.toHaveBeenCalled();
}));


  it('should call getPartData if partId is present', () => {
    const spy = spyOn(component as any, 'getPartData').and.callThrough();
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith('123');
  });

  it('should map vendorCostList correctly using vendorCostListToMap', () => {
    const vendorCostList = [
      {
        id: 1,
        vendorName: 'Vendor A',
        costFactorValues: [
          { id: 101, factorName: 'Labor', value: 200 },
          { id: 102, factorName: 'Material', value: 300 }
        ]
      },
      {
        id: 2,
        vendorName: 'Vendor B',
        costFactorValues: [
          { id: 103, factorName: 'Overhead', value: 150 }
        ]
      }
    ] as any;
  
    component.vendorCostListToMap(vendorCostList);
  
    expect(component.vendorCostMap.size).toBe(2);
    expect(component.vendorCostMap.get(1)?.length).toBe(2);
    expect(component.vendorCostMap.get(2)?.[0].factorName).toBe('Overhead');
  });
  

  it('should add vendor to vendorCostMap', () => {
    const vendor = { id: 10, vendorName: 'Vendor X' } as any;
    component.addVendor(vendor);
    expect(component.vendorCostMap.has(10)).toBeTrue();
  });

  it('should not add vendor again if already exists in vendorCostMap', () => {
    const vendor = { id: 20, vendorName: 'Vendor Y' } as any;
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
      { id: 101, factorName: 'Labor', value: 200 },
      { id: 102, factorName: 'Material', value: 300 }
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
    const vendor = { id: 1, vendorName: 'Test Vendor' } as any;
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
    component.vendorList.push({ id: 1, vendorName: 'Vendor' } as any);

    component.clearVendorCostData();

    expect(component.vendorCostMap.size).toBe(0);
  });

  it('should return vendor name if vendor exists', () => {
    component.vendorList = [{ id: 1, vendorName: 'Vendor X' } as any];
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
    const mockFactor = { id: 1, factorName: 'Labor', value: 10 };
    component.costFactors.push(new FormControl(mockFactor));
  
    const spy = spyOn(component, 'addCostFactor');
    component.addCostFactorFromFieldValue(0, 2);
    expect(spy).toHaveBeenCalledWith(mockFactor, 2);
  });

  it('should add cost factor to vendorCostMap if not present', () => {
    const vendorId = 3;
    const costFactor = { id: 1, factorName: 'Labor', value: 50 };
  
    component.addCostFactor(costFactor, vendorId);
    expect(component.vendorCostMap.get(vendorId)).toContain(jasmine.objectContaining({ id: 1, factorName: 'Labor' }));
  });
  
  it('should not add duplicate cost factor', () => {
    const vendorId = 3;
    const costFactor = { id: 1, factorName: 'Labor', value: 50 };
    component.vendorCostMap.set(vendorId, [costFactor]);
  
    component.addCostFactor(costFactor, vendorId);
    expect(component.vendorCostMap.get(vendorId)?.length).toBe(1);
  });
  
  it('should call processFiles with selected files in onFilesSelected', () => {
  const file = new File([''], 'test.png', { type: 'image/png' });
  const event = { target: { files: { length: 1, 0: file, item: () => file } } };
  spyOn(component, 'processFiles');
  component.onFilesSelected(event as any);
  expect(component.processFiles).toHaveBeenCalledWith([file]);
  });
  it('should open confirmation dialog and remove attribute if DELETE is confirmed', () => {
    const attrToRemove = { attributeId: 1, attributeName: 'Test Attribute' } as any;

    component.attributeValueList = [
      { attributeId: 1, attributeName: 'Test Attribute' },
      { attributeId: 2, attributeName: 'Another Attribute' }
    ] as any[];

    const afterClosedSpy = of(DialogCloseResponse.DELETE);
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: afterClosedSpy, close: null });

    mockDialog.open.and.returnValue(dialogRefSpyObj);

    component.removeDeletedAttribute(attrToRemove);

    expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, jasmine.objectContaining({
      data: jasmine.objectContaining({
        title: 'Confirm Deletion',
        message: jasmine.stringMatching(/Test Attribute/)
      })
    }));

    expect(component.attributeValueList.length).toBe(1);
    expect(component.attributeValueList[0].attributeId).toBe(2);
  });

  it('should not remove attribute if DELETE is not confirmed', () => {
    const attrToRemove = { attributeId: 1, attributeName: 'Test Attribute' } as any;

    component.attributeValueList = [
      { attributeId: 1, attributeName: 'Test Attribute' },
      { attributeId: 2, attributeName: 'Another Attribute' }
    ] as any[];

    const afterClosedSpy = of('SOME_OTHER_ACTION');
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: afterClosedSpy, close: null });

    mockDialog.open.and.returnValue(dialogRefSpyObj);

    component.removeDeletedAttribute(attrToRemove);

    expect(component.attributeValueList.length).toBe(2);
  });
   it('should fetch part files and download image previews', fakeAsync(() => {
    const mockUrls = ['file1.png', 'file2.pdf'];
    const mockDownloadResponse = { fileData: 'mockBase64Data' };

    mockPartService.getPartFiles.and.returnValue(of(mockUrls));
    mockPartService.downloadPartFile.and.callFake((url: string) => {
      if (url.endsWith('.png')) {
        return of(mockDownloadResponse);
      } else {
        return of({});
      }
    });

    component.getPartFiles('123');

    expect(mockPartService.getPartFiles).toHaveBeenCalledWith('123');
    expect(mockPartService.downloadPartFile).toHaveBeenCalledWith('file1.png');

    const imagePreview = component.partFilePreviews.find(p => p.url === 'file1.png');
    const pdfPreview = component.partFilePreviews.find(p => p.url === 'file2.pdf');

    expect(imagePreview).toBeDefined();
    expect(imagePreview!.previewUrl).toBe('data:image/png;base64,mockBase64Data');

    expect(pdfPreview).toBeDefined();
    expect(pdfPreview!.previewUrl).toBeUndefined();
  }));

  it('should handle error when getPartFiles fails', () => {
    mockPartService.getPartFiles.and.returnValue(throwError(() => new Error('API failed')));

    spyOn(console, 'error');
    component.getPartFiles('123');

    expect(console.error).toHaveBeenCalledWith('Error fetching part files:', jasmine.any(Error));
  });

  it('it should process the file when files are added',() =>{
      const mockFile1 = new File(['file content 1'], 'file1.jpg', { type: 'image/jpeg' });
      const mockFile2 = new File(['file content 2'], 'file2.txt');
      const fileList: FileList = {
          0: mockFile1,
          1: mockFile2,
      length: 2,
      item: (index: number) => [mockFile1, mockFile2][index]
  };
  const event = { target: { files: fileList } };
  spyOn(component, 'processFiles');

  component.onFilesSelected(event as any);

  expect(component.processFiles).toHaveBeenCalledWith([mockFile1, mockFile2]);
  });

it('should add valid files to selected files', () => {
  component.selectedFiles = [];
  component.maxFiles = 3;

  const mockFile1 = new File(['file content 1'], 'file1.jpg', { type: 'image/jpeg' });
  const mockFile2 = new File(['file content 2'], 'file2.txt');
  Object.defineProperty(mockFile2, 'type', { value: 'text/plain' });

  it('should set isDragOver true and prevent default in allowDrop', () => {
  const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
  component.isDragOver = false;
  component.allowDrop(event as any);
  expect(component.isDragOver).toBeTrue();
  expect(event.preventDefault).toHaveBeenCalled();
  expect(event.stopPropagation).toHaveBeenCalled();
});

it('should set isDragOver false and call processFiles in handleDrop', () => {
  const file = new File([''], 'test.png', { type: 'image/png' });
  const files = { length: 1, 0: file, item: () => file };
  const event = {
    preventDefault: jasmine.createSpy('preventDefault'),
    stopPropagation: jasmine.createSpy('stopPropagation'),
    dataTransfer: { files: files }
  };
  spyOn(component, 'processFiles');
  component.isDragOver = true;
  component.handleDrop(event as any);
  expect(component.isDragOver).toBeFalse();
  expect(component.processFiles).toHaveBeenCalledWith([file]);
});

it('should set isDragOver false and not call processFiles if no files in handleDrop', () => {
  const event = {
    preventDefault: jasmine.createSpy('preventDefault'),
    stopPropagation: jasmine.createSpy('stopPropagation'),
    dataTransfer: { files: { length: 0 } }
  };
  spyOn(component, 'processFiles');
  component.isDragOver = true;
  component.handleDrop(event as any);
  expect(component.isDragOver).toBeFalse();
  expect(component.processFiles).not.toHaveBeenCalled();
});

it('should set isDragOver false and prevent default in dragLeave', () => {
  const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
  component.isDragOver = true;
  component.dragLeave(event as any);
  expect(component.isDragOver).toBeFalse();
  expect(event.preventDefault).toHaveBeenCalled();
  expect(event.stopPropagation).toHaveBeenCalled();
});

it('should filter out invalid files and show error in processFiles', () => {
  Object.defineProperty(component, 'allowedFileTypes', { value: ['image/png'] });
  const validFile = new File([''], 'test.png', { type: 'image/png' });
  const invalidFile = new File([''], 'bad.exe', { type: 'application/x-msdownload' });
  component.selectedFiles = [];
  component.processFiles([validFile, invalidFile]);
  expect(component.selectedFiles.length).toBe(1);
  expect(component.selectedFiles[0]).toBe(validFile);
  expect(snackbarService.error).toHaveBeenCalledWith('Some files were not allowed and have been skipped.');
});

it('should show error if trying to add more than maxFiles in processFiles', () => {
  component.maxFiles = 1;
  component.selectedFiles = [new File([''], 'existing.png', { type: 'image/png' })];
  const validFile = new File([''], 'test.png', { type: 'image/png' });
  component.processFiles([validFile]);
  expect(snackbarService.error).toHaveBeenCalledWith('You can upload maximum 1 files.');
});

it('should add valid files to selectedFiles in processFiles', () => {
  Object.defineProperty(component, 'allowedFileTypes', { value: ['image/png'] });
  component.maxFiles = 2;
  component.selectedFiles = [];
  const validFile = new File([''], 'test.png', { type: 'image/png' });
  component.processFiles([validFile]);
  expect(component.selectedFiles).toContain(validFile);
});

it('should remove file at given index in removeFile', () => {
  const file1 = new File([''], 'a.png', { type: 'image/png' });
  const file2 = new File([''], 'b.png', { type: 'image/png' });
  component.selectedFiles = [file1, file2];
  component.removeFile(0);
  expect(component.selectedFiles).toEqual([file2]);
});

it('should return correct file type from file name in getFileTypeFromName', () => {
  expect(component.getFileTypeFromName('photo.png')).toBe('image');
  expect(component.getFileTypeFromName('picture.JPG')).toBe('image');
  expect(component.getFileTypeFromName('doc.pdf')).toBe('pdf');
  expect(component.getFileTypeFromName('sheet.xls')).toBe('excel');
  expect(component.getFileTypeFromName('file.docx')).toBe('word');
  expect(component.getFileTypeFromName('unknown.abc')).toBe('other');
  expect(component.getFileTypeFromName('noextension')).toBe('other');
});

it('should return file name from URL in getFileNameFromUrl', () => {
  expect(component.getFileNameFromUrl('http://host/path/file.pdf')).toBe('file.pdf');
  expect(component.getFileNameFromUrl('file.pdf')).toBe('file.pdf');
  expect(component.getFileNameFromUrl('')).toBe('');
});

it('should return object URL in getImagePreview', () => {
  const file = new File([''], 'img.png', { type: 'image/png' });
  spyOn(URL, 'createObjectURL').and.returnValue('blob:http://test');
  expect(component.getImagePreview(file)).toBe('blob:http://test');
});

it('should return correct type in getFileType', () => {
  expect(component.getFileType({ type: 'image/png' })).toBe('image');
  expect(component.getFileType({ type: 'application/pdf' })).toBe('pdf');
  expect(component.getFileType({ type: 'application/msword' })).toBe('word');
  expect(component.getFileType({ type: 'application/vnd.ms-excel' })).toBe('excel');
  expect(component.getFileType({ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })).toBe('excel');
  expect(component.getFileType({ type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })).toBe('word');
  expect(component.getFileType({ type: 'application/x-unknown' })).toBe('other');
  expect(component.getFileType({ type: undefined })).toBe('other');
  expect(component.getFileType({ type: '' })).toBe('other');
});

  mockSnackbarService.error.calls.reset();
  component.processFiles([mockFile1, mockFile2]);
  expect(component.selectedFiles).toEqual([mockFile1, mockFile2]);
  expect(mockSnackbarService.error).toHaveBeenCalledTimes(0);
});


it('should skip files with types not in allowedFileTypes', () => {
    const validFile = new File([''], 'doc.pdf', { type: 'application/pdf' });
    const invalidFile = new File([''], 'video.mp4', { type: 'video/mp4' });
    mockSnackbarService.error.calls.reset();
    component.processFiles([validFile, invalidFile]);

    expect(component.selectedFiles).toEqual([validFile]);
    expect(mockSnackbarService.error)
      .toHaveBeenCalledWith('Some files were not allowed and have been skipped.');
  });

  it('should give error when the maxfile is less than the uploaded files',() =>{
    component.selectedFiles = [];
    component.maxFiles = 1;
    const mockFile1 = new File(['file content 1'], 'file1.jpg', { type: 'image/jpeg' });
    const mockFile2 = new File(['file content 2'], 'file2.doc', { type: 'application/msword' });
    mockSnackbarService.error.calls.reset();
    component.processFiles([mockFile1,mockFile2]);

    expect(component.selectedFiles).toEqual([]);
    expect(mockSnackbarService.error)
      .toHaveBeenCalledWith('You can upload maximum 1 files.');
  });

  it('should remove file from the selected files',()=>{
        const mockFile1 = new File(['file content 1'], 'file1.jpg', { type: 'image/jpeg' });
    const mockFile2 = new File(['file content 2'], 'file2.doc', { type: 'application/msword' });
    component.selectedFiles=[mockFile1,mockFile2];
    component.removeFile(1);

    expect(component.selectedFiles).toEqual([mockFile1]);
    expect(component.selectedFiles.length).toBe(1);
  });

  it('should return file type from the extension',()=>{
    expect(component.getFileTypeFromName('pic.jpg')).toBe('image');
    expect(component.getFileTypeFromName('pdf.pdf')).toBe('pdf');
    expect(component.getFileTypeFromName('word.doc')).toBe('word');
    expect(component.getFileTypeFromName('data.xls')).toBe('excel');

  });
  it('should return file name from a URL', () => {
      expect(component.getFileNameFromUrl('https://example.com/path/file.pdf'))
        .toBe('file.pdf');
    });

    it('should return the whole string if no slash exists', () => {
      expect(component.getFileNameFromUrl('file.pdf')).toBe('file.pdf');
    });

     it('should call URL.createObjectURL and return the value', () => {
      const mockFile = new File(['content'], 'file.png', { type: 'image/png' });
      const mockUrl = 'blob:mockurl';
      spyOn(URL, 'createObjectURL').and.returnValue(mockUrl);

      const result = component.getImagePreview(mockFile);

      expect(URL.createObjectURL).toHaveBeenCalledWith(mockFile);
      expect(result).toBe(mockUrl);
    });

     it('should return type for META types', () => {
      expect(component.getFileType({ type: 'image/png' })).toBe('image');
      expect(component.getFileType({ type: 'application/pdf' })).toBe('pdf');
      expect(component.getFileType({ type: 'application/msword' })).toBe('word');
      expect(component.getFileType({ type: 'application/vnd.ms-excel' })).toBe('excel');
    });
});

