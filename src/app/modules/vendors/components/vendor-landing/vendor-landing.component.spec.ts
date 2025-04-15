import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VendorLandingComponent } from './vendor-landing.component';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { SnackbarService } from '../../../../data/services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { SortIcons, TableActions } from '../../../../shared/constants/table.constants';
import { MatIconModule } from '@angular/material/icon';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

fdescribe('VendorLandingComponent', () => {
  let component: VendorLandingComponent;
  let fixture: ComponentFixture<VendorLandingComponent>;
  let vendorServiceSpy: jasmine.SpyObj<VendorService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackbarSpy: jasmine.SpyObj<SnackbarService>;

  beforeEach(async () => {
    vendorServiceSpy = jasmine.createSpyObj('VendorService', ['getVendorList', 'deleteVendor', 'downloadExcel']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackbarSpy = jasmine.createSpyObj('SnackbarService', ['success']);

    vendorServiceSpy.getVendorList.and.returnValue(of({
      data: [{ id: 1, name: 'Vendor A' }],
      pageInfo: { totalRecords: 1 }
    }));
    vendorServiceSpy.deleteVendor.and.returnValue(of(undefined));

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(DialogCloseResponse.DELETE)
    } as any);

    await TestBed.configureTestingModule({
      declarations: [VendorLandingComponent],
      imports: [MatIconModule],
      providers: [
        { provide: VendorService, useValue: vendorServiceSpy },
        { provide: SnackbarService, useValue: snackbarSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch vendor list on init', () => {
    expect(vendorServiceSpy.getVendorList).toHaveBeenCalled();
    expect(component.vendorList.length).toBeGreaterThan(0);
    expect(component.totalRecords).toBe(1);
  });

  it('should navigate to vendor create page', () => {
    component.createVendor();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/app/vendors/create');
  });

  it('should apply filter and debounce', fakeAsync(() => {
  
    component.applyFilter({ key: 'name', value: 'test' });
  
    tick(300);
    fixture.detectChanges();
  
    expect(vendorServiceSpy.getVendorList).toHaveBeenCalledWith(
      0,
      100,
      new Map([['name', 'test']]),
      { sortColumn: 'name', sortState: SortIcons.ASC }
    );
  }));  
  

  it('should sort data when applySort is called', () => {
    const expectedFilter = new Map();
    const expectedSort = { sortColumn: 'name', sortState: SortIcons.ASC };
  
    component.applySort(expectedSort);
  
    expect(component.sortState.sortColumn).toBe('name');
    expect(vendorServiceSpy.getVendorList).toHaveBeenCalledWith(
      0,
      100,
      expectedFilter,
      expectedSort
    );
  });

  it('should handle EDIT action', () => {
    const event = { action: TableActions.EDIT, row: { id: 1 } };
    component.handleAction(event);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/app/vendors/edit/1');
  });

  it('should open dialog and delete vendor on DELETE', () => {
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(DialogCloseResponse.DELETE) });
    dialogSpy.open.and.returnValue(dialogRefSpy);
  
    vendorServiceSpy.deleteVendor.and.returnValue(of(void 0));

    const event = { action: TableActions.DELETE, row: { id: 1 } };
    component.handleAction(event);
  
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(vendorServiceSpy.deleteVendor).toHaveBeenCalledWith('1');
    expect(snackbarSpy.success).toHaveBeenCalledWith('Vendor deleted successfully!');
  });
  

  it('should trigger file download', () => {
    const base64String = btoa('test file content');
    vendorServiceSpy.downloadExcel.and.returnValue(of({ fileData: base64String, fileName: 'vendorList.xlsx' }));
  
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
    const mockAnchor = { click: jasmine.createSpy('click'), href: '', download: '' } as any;
    spyOn(document, 'createElement').and.returnValue(mockAnchor);
  
    component.downloadExcel();
  
    expect(vendorServiceSpy.downloadExcel).toHaveBeenCalled();
    expect(mockAnchor.click).toHaveBeenCalled();
  });
  

  it('should change page on pagination', () => {
    const expectedFilter = new Map();
    const expectedSort = { sortColumn: 'name', sortState: SortIcons.ASC };

  
    const event: PageEvent = { pageIndex: 1, pageSize: 10, length: 2 };
    component.sortState = expectedSort;
    component.onPageChange(event);
  
    expect(component.currentPage).toBe(1);
    expect(component.pageSize).toBe(10);
  
    expect(vendorServiceSpy.getVendorList).toHaveBeenCalledWith(
      1,
      10,
      expectedFilter,
      expectedSort
    );
  });  
});
