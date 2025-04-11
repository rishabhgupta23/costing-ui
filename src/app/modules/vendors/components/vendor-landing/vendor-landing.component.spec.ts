import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorLandingComponent } from './vendor-landing.component';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { SnackbarService } from '../../../../data/services/snackbar/snackbar.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

fdescribe('VendorLandingComponent', () => {
  let component: VendorLandingComponent;
  let fixture: ComponentFixture<VendorLandingComponent>;
  let vendorServiceSpy: jasmine.SpyObj<VendorService>;

  const mockVendorResponse = {
    data: [
      { id: 1, name: 'Test Vendor' }
    ],
    pageInfo: {
      totalRecords: 1
    }
  };

  beforeEach(async () => {
    vendorServiceSpy = jasmine.createSpyObj('VendorService', ['getVendorList']);
    vendorServiceSpy.getVendorList.and.returnValue(of(mockVendorResponse));
    await TestBed.configureTestingModule({
      declarations: [VendorLandingComponent] ,
      providers: [
        { provide: VendorService, useValue: vendorServiceSpy },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigateByUrl']) },
        { provide: SnackbarService, useValue: jasmine.createSpyObj('SnackbarService', ['success']) },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call vendorService.getVendorList and update vendorList and totalRecords', () => {
    //vendorServiceSpy.getVendorList.and.returnValue(of(mockVendorResponse));

    component.getVendorList();

    expect(vendorServiceSpy.getVendorList).toHaveBeenCalledWith(
      component.currentPage,
      component.pageSize,
      component.filterCriteria,
      component.sortState
    );
    expect(component.vendorList).toEqual(mockVendorResponse.data);
    expect(component.totalRecords).toBe(1);
  });
});
