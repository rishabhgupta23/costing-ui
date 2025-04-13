import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorLandingComponent } from './vendor-landing.component';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { SnackbarService } from '../../../../data/services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PageEvent } from '@angular/material/paginator';
import { SortIcons, TableActions } from '../../../../shared/constants/table.constants';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { MatIconModule } from '@angular/material/icon';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

fdescribe('VendorLandingComponent', () => {
  let component: VendorLandingComponent;
  let fixture: ComponentFixture<VendorLandingComponent>;

  let vendorServiceSpy: jasmine.SpyObj<VendorService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockVendors = [
    { id: 1, name: 'Vendor A' },
    { id: 2, name: 'Vendor B' }
  ];

  beforeEach(async () => {
    const vendorService = jasmine.createSpyObj('VendorService', ['getVendorList', 'deleteVendor', 'downloadExcel']);
    const snackbarService = jasmine.createSpyObj('SnackbarService', ['success']);
    const dialog = jasmine.createSpyObj('MatDialog', ['open']);
    const router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [VendorLandingComponent],
      imports: [
        MatIconModule,
      ],
      providers: [
        provideHttpClientTesting(),
        { provide: VendorService, useValue: vendorService },
        { provide: SnackbarService, useValue: snackbarService },
        { provide: MatDialog, useValue: dialog },
        { provide: Router, useValue: router },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    vendorServiceSpy = TestBed.inject(VendorService) as jasmine.SpyObj<VendorService>;
    snackbarServiceSpy = TestBed.inject(SnackbarService) as jasmine.SpyObj<SnackbarService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    vendorServiceSpy.getVendorList.and.returnValue(of({ data: mockVendors, pageInfo: { totalRecords: 2 } }));

    fixture = TestBed.createComponent(VendorLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch vendor list on init', () => {
    expect(vendorServiceSpy.getVendorList).toHaveBeenCalled();
    expect(component.vendorList.length).toBe(2);
  });

  it('should apply sort and fetch sorted vendor list', () => {
    const sortState = { sortColumn: 'name', sortState: SortIcons.DESC };
    component.applySort(sortState);
    expect(component.sortState).toEqual(sortState);
    expect(vendorServiceSpy.getVendorList).toHaveBeenCalledTimes(2);
  });

  it('should apply filter and trigger search subject', () => {
    const filter = { key: 'name', value: 'A' };
    component.applyFilter(filter);
    expect(component.filterCriteria.get('name')).toBe('A');
  });

  it('should navigate to create vendor page', () => {
    component.createVendor();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/app/vendors/create');
  });

  it('should handle EDIT action and navigate to edit page', () => {
    const row = { id: 1 };
    component.handleAction({ action: TableActions.EDIT, row });
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/app/vendors/edit/1');
  });

  it('should call downloadExcel and trigger download', () => {
    const fileResponse = {
      fileData: new Blob(['mock data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      fileName: 'vendors.xlsx'
    };
    vendorServiceSpy.downloadExcel.and.returnValue(of(fileResponse));

    spyOn<any>(component, 'downloadExcel').and.callThrough();

    component.downloadExcel();

    expect(vendorServiceSpy.downloadExcel).toHaveBeenCalled();
  });

  it('should change pagination and fetch new page', () => {
    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 50, length: 2 };
    component.onPageChange(pageEvent);
    expect(component.currentPage).toBe(1);
    expect(component.pageSize).toBe(50);
    expect(vendorServiceSpy.getVendorList).toHaveBeenCalledTimes(2);
  });

  it('should open discard dialog and delete vendor if confirmed', () => {
    const mockRow = { id: 1 };
  
    // Mock the deleteVendor method to return a successful observable (without value, like Observable<void>)
    vendorServiceSpy.deleteVendor.and.returnValue(of(undefined));  // Using of(undefined) to return Observable<void>
  
    // Create a spy for the dialog's afterClosed method to simulate the DELETE response
    const afterClosedSpy = jasmine.createSpyObj('afterClosed', ['subscribe']);
    afterClosedSpy.subscribe.and.callFake((fn: any) => fn(DialogCloseResponse.DELETE)); // Simulate DELETE response
  
    // Mock the dialog open method to return the afterClosed spy
    dialogSpy.open.and.returnValue({ afterClosed: () => afterClosedSpy } as any);
  
    // Call the method that opens the discard dialog
    component.openDiscardDialog(mockRow);
  
    // Ensure that deleteVendor was called with the correct argument
    expect(vendorServiceSpy.deleteVendor).toHaveBeenCalledWith('1');
  
    // Ensure the Snackbar success method is called with the expected message after the vendor is deleted
    expect(snackbarServiceSpy.success).toHaveBeenCalledWith('Vendor deleted successfully!');
  });
  

  it('should handle DELETE action by opening discard dialog', () => {
    const mockRow = { id: 1 };
    spyOn(component, 'openDiscardDialog');
    component.handleAction({ action: TableActions.DELETE, row: mockRow });
    expect(component.openDiscardDialog).toHaveBeenCalledWith(mockRow);
  });
});
