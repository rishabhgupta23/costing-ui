import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartViewComponent } from './part-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { PartService } from '../../../../data/services/part/part.service';
import { MatDialog } from '@angular/material/dialog';
import { MOCK_PART_WITH_BOM_ONLY, MOCK_SINGLE_PART } from '../../../../mock-data/part.mock-data';
import { CostHistoryResponse } from '../../../../data/models/part';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatSelectModule } from '@angular/material/select'; 


describe('PartViewComponent', () => {
  let component: PartViewComponent;
  let fixture: ComponentFixture<PartViewComponent>;
  let partServiceSpy: jasmine.SpyObj<PartService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    partServiceSpy = jasmine.createSpyObj('PartService', ['getPartById', 'getPartCostByPartAndVendor', 'downloadBomExcel']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [PartViewComponent],
      imports:[ MatFormFieldModule,MatInputModule,MatSelectModule],
      providers: [
        { provide: PartService, useValue: partServiceSpy},
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PartViewComponent);
    component = fixture.componentInstance;
    partServiceSpy = TestBed.inject(PartService) as jasmine.SpyObj<PartService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch part data and populate form & map on init', () => {
    partServiceSpy.getPartById.and.returnValue(of(MOCK_SINGLE_PART));
    component.ngOnInit();

    expect(partServiceSpy.getPartById).toHaveBeenCalledWith('1');
    expect(component.vendorCostList.length).toBe(1);
    expect(component.partForm.value.partName).toBe('UPDATED PART');
    expect(component.vendorCostMap.get(1)?.length).toBe(2);
  });

  it('should populate BOM if no vendor cost list is present', () => {
    partServiceSpy.getPartById.and.returnValue(of(MOCK_PART_WITH_BOM_ONLY));
    component.ngOnInit();
  
    expect(component.vendorCostList.length).toBe(0);
    expect(component.bomPartList.length).toBe(1);
    expect(component.bomPartList[0].partName).toBe('abc');
    expect(component.bomPartList[0].partNumber).toBe('12');
    expect(component.bomPartList[0].value).toBe(5.0);
  });

  



  it('should navigate to edit page on editPart()', () => {
    component.partId = '123';
    component.editPart();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/app/parts/edit/123');
  }); 

  it('should open history dialog with correct data', () => {
    const costHistoryMock: CostHistoryResponse = {
      partId: 1,
      vendorId: 1,
      costHistoryList: [
        {
          updatedDateTime: '2024-01-01T00:00:00Z',
          costFactorList: [
            { id: 1, factorName: 'Labor Cost', value: 100 }
          ]
        }
      ]
    };
  
    partServiceSpy.getPartCostByPartAndVendor.and.returnValue(of(costHistoryMock));
  
  const afterClosedMock = {
    subscribe: jasmine.createSpy('subscribe').and.callFake((cb: any) => cb())
  };

  dialogSpy.open.and.returnValue({
    afterClosed: () => afterClosedMock
  } as any);
  
    component.openHistoryDialog('1', 1);
  
    expect(partServiceSpy.getPartCostByPartAndVendor).toHaveBeenCalledWith('1', 1);
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(component.costHistoryList.length).toBe(1);
    expect(component.costHistoryList[0].updatedDateTime).toBe('2024-01-01T00:00:00Z');
  });
  

  it('should call downloadBomExcel and trigger file download', () => {
    const base64String = btoa('mock file content');
    const mockResponse = {
      fileData: base64String,
      fileName: 'bomPartList.xlsx'
    };
  
    const mockAnchor = {
      click: jasmine.createSpy('click'),
      href: '',
      download: ''
    } as any;
  
    spyOn(document, 'createElement').and.returnValue(mockAnchor);
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
  
    partServiceSpy.downloadBomExcel.and.returnValue(of(mockResponse));
  
    component.partId = '1';
    component.downloadBomExcel();
  
    expect(partServiceSpy.downloadBomExcel).toHaveBeenCalledWith('1');
    expect(mockAnchor.download).toBe('bomPartList.xlsx');
    expect(mockAnchor.href).toBe('blob:url');
    expect(mockAnchor.click).toHaveBeenCalled();
  });
  
  

  it('should return formatted vendor cost table data', () => {
    component.vendorCostMap.set(1, [
      { id: 1, factorName: 'Labor Cost', value: 100 },
      { id: 2, factorName: 'Material Cost', value: 200 }
    ]);
    component.vendorCostList = [{ id: 1, name: 'XYZ Vendor', costFactorValues: [] }] as any;

    const data = component.getVendorCostTableData();
    expect(data.length).toBe(2);
    expect(data[0].vendorName).toBe('XYZ Vendor');
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const mockSub = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.subscriptions.push(mockSub);
  
    component.ngOnDestroy();
  
    expect(mockSub.unsubscribe).toHaveBeenCalled();
  });
  
});
