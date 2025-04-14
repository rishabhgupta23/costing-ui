import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PartLandingComponent } from './part-landing.component';
import { of, throwError } from 'rxjs';
import { PartService } from '../../../../data/services/part/part.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../data/services/snackbar/snackbar.service';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { MOCK_PART_LIST_RESPONSE } from '../../../../mock-data/part.mock-data';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SortIcons, TableActions } from '../../../../shared/constants/table.constants';
import { MatIconModule } from '@angular/material/icon';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { SnackbarComponent } from '../../../../shared/components/snackbar/snackbar.component';

fdescribe('PartLandingComponent', () => {
  let component: PartLandingComponent;
  let fixture: ComponentFixture<PartLandingComponent>;
  let partServiceSpy: jasmine.SpyObj<PartService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackbarSpy: jasmine.SpyObj<SnackbarService>;

  beforeEach(async () => {
    const partSpy = jasmine.createSpyObj('PartServiceSpy', ['getPartList', 'deletePart', 'downloadExcel']);
    const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    const snackbarMock = jasmine.createSpyObj('SnackbarService', ['success']);

    await TestBed.configureTestingModule({
      declarations: [PartLandingComponent],
      imports: [MatIconModule, TableComponent, MatPaginatorModule, SnackbarComponent],
      providers: [
        { provide: PartService, useValue: partSpy },
        { provide: Router, useValue: routerMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: SnackbarService, useValue: snackbarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PartLandingComponent);
    component = fixture.componentInstance;

    partServiceSpy = TestBed.inject(PartService) as jasmine.SpyObj<PartService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    snackbarSpy = TestBed.inject(SnackbarService) as jasmine.SpyObj<SnackbarService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPartList on init', () => {
    const getPartListSpy = spyOn(component, 'getPartList');
    component.ngOnInit();
    expect(getPartListSpy).toHaveBeenCalled();
  });  

  it('should fetch and map part list correctly for defined and undefined maxVendorCount', () => {
    const addColumnsSpy = spyOn(component, 'addColumnsForVendor').and.callThrough();
  
    // Case 1: maxVendorCount defined
    partServiceSpy.getPartList.and.returnValue(of(MOCK_PART_LIST_RESPONSE));
    component.getPartList();
  
    expect(partServiceSpy.getPartList).toHaveBeenCalled();
    expect(component.partList.length).toBe(2);
    expect(component.totalRecords).toBe(2);
    expect(addColumnsSpy).toHaveBeenCalledWith(1);
    expect(component.columns.some(col => col.label === 'Vendor 1')).toBeTrue();
  
    addColumnsSpy.calls.reset();
    component.columns = [];
  
    const mockWithoutMaxVendor = {
      data: {
        partsList: MOCK_PART_LIST_RESPONSE.data.partsList

      }
    };
  
    partServiceSpy.getPartList.and.returnValue(of(mockWithoutMaxVendor));
    component.getPartList();
  
    expect(addColumnsSpy).toHaveBeenCalledWith(0);
    expect(component.partList.length).toBe(2);
    expect(component.columns.some(col => col.label.startsWith('Vendor'))).toBeFalse();
  });
  
  

  it('should navigate to create part page', () => {
    component.createPart();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/app/parts/create');
  });
  
  it('should navigate on row click', () => {
    const row = { partId: 1 };
    component.onRowClicked(row);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/app/parts/view/1');
  });

  it('should apply filter and debounce', fakeAsync(() => {

    partServiceSpy.getPartList.and.returnValue(of(MOCK_PART_LIST_RESPONSE));
  
    component.ngOnInit();
    fixture.detectChanges();

    component.applyFilter({ key: 'partName', value: 'test' });
  
    tick(300);
    fixture.detectChanges();
  
 
    expect(partServiceSpy.getPartList).toHaveBeenCalledWith(
      0,
      100,
      new Map([['partName', 'test']]),
      undefined,
      { sortColumn: 'partNumber', sortState: SortIcons.ASC }
    );
    
  }));
  

  it('should sort data when applySort is called', () => {
    const expectedFilter = new Map();
    const expectedSort = { sortColumn: 'partName', sortState: SortIcons.ASC };
  
    partServiceSpy.getPartList.and.returnValue(of(MOCK_PART_LIST_RESPONSE));
  
    component.applySort(expectedSort);
  
    expect(component.sortState.sortColumn).toBe('partName');
    expect(partServiceSpy.getPartList).toHaveBeenCalledWith(
      0,
      100,
      expectedFilter,
      undefined,
      expectedSort
    );
  });
  

  it('should change page on pagination', () => {
    const expectedFilter = new Map();
    const expectedSort = { sortColumn: 'partNumber', sortState: SortIcons.ASC };
    partServiceSpy.getPartList.and.returnValue(of(MOCK_PART_LIST_RESPONSE));
    const event: PageEvent = { pageIndex: 1, pageSize: 10, length: 2 };
    component.sortState = expectedSort;
    component.onPageChange(event);
    expect(component.currentPage).toBe(1);
    expect(component.pageSize).toBe(10);
  
    expect(partServiceSpy.getPartList).toHaveBeenCalledWith(
      1,
      10,
      expectedFilter,
      undefined,
      expectedSort
    );
  });
  

  it('should navigate to edit page on EDIT action', () => {
    const event = { action: TableActions.EDIT, row: { partId: 1 } };
    component.handleAction(event);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/app/parts/edit/1');
  });

  it('should open dialog and delete part on DELETE', () => {
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(DialogCloseResponse.DELETE) });
    dialogSpy.open.and.returnValue(dialogRefSpy);
    
    partServiceSpy.deletePart.and.returnValue(of(void 0));
  
    partServiceSpy.getPartList.and.returnValue(of(MOCK_PART_LIST_RESPONSE));
  
    const event = { action: TableActions.DELETE, row: { partId: '1' } };
    component.handleAction(event);
  
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(partServiceSpy.deletePart).toHaveBeenCalledWith('1');
    expect(snackbarSpy.success).toHaveBeenCalledWith('Part deleted successfully');
  });
  

  it('should handle error while loading parts', () => {
    spyOn(console, 'error');
    partServiceSpy.getPartList.and.returnValue(throwError(() => new Error('Network error')));
    component.getPartList();
    expect(console.error).toHaveBeenCalledWith('Error fetching part list:', jasmine.any(Error));
  });

  it('should trigger file download', () => {
    const base64String = btoa('test'); // base64-encode mock file content
    partServiceSpy.downloadExcel.and.returnValue(of({ fileData: base64String, fileName: 'partList.xlsx' }));
    
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
    const mockAnchor = { click: jasmine.createSpy('click') } as any;
    spyOn(document, 'createElement').and.returnValue(mockAnchor);
  
    component.downloadExcel();
  
    expect(partServiceSpy.downloadExcel).toHaveBeenCalled();
    expect(mockAnchor.click).toHaveBeenCalled();
  });
  
});
