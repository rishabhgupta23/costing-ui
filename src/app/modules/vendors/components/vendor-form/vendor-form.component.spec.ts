import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VendorFormComponent } from './vendor-form.component';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { SnackbarService } from '../../../../data/services/snackbar/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Vendor } from '../../../../data/models/vendor';

describe('VendorFormComponent', () => {
  let component: VendorFormComponent;
  let fixture: ComponentFixture<VendorFormComponent>;
  let vendorServiceSpy: jasmine.SpyObj<VendorService>;
  let snackbarSpy: jasmine.SpyObj<SnackbarService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    vendorServiceSpy = jasmine.createSpyObj('VendorService', ['getVendorById', 'createVendor', 'updateVendor']);
    snackbarSpy = jasmine.createSpyObj('SnackbarService', ['success']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [VendorFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: VendorService, useValue: vendorServiceSpy },
        { provide: SnackbarService, useValue: snackbarSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null // no vendorId by default
              }
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values in create mode', () => {
    expect(component.vendorForm).toBeDefined();
    expect(component.vendorForm.get('name')?.value).toBe('');
  });

  it('should show error message for required name field', () => {
    component.vendorForm.get('name')?.setValue('');
    component.vendorForm.get('name')?.markAsTouched();
    expect(component.getErrorMessage('name')).toContain('is required');
  });

  it('should fetch and populate vendor data in edit mode', () => {
    const mockVendor: Vendor = {
      id: 1,
      name: 'Vendor A',
      emailId: 'vendor@example.com',
      contactNumber: '1234567890',
      address: 'Test Address'
    };

    vendorServiceSpy.getVendorById.and.returnValue(of(mockVendor));

    const activatedRoute = TestBed.inject(ActivatedRoute);
    spyOn(activatedRoute.snapshot.paramMap, 'get').and.returnValue('1');

    component.ngOnInit();

    expect(vendorServiceSpy.getVendorById).toHaveBeenCalledWith('1');
  });

  it('should call createVendor on valid form submission in create mode', () => {
    component.vendorForm.setValue({
      name: 'Vendor A',
      emailId: 'vendor@example.com',
      contactNumber: '1234567890',
      address: 'Test Address'
    });

    vendorServiceSpy.createVendor.and.returnValue(of({}));

    component.onSubmit();

    expect(vendorServiceSpy.createVendor).toHaveBeenCalled();
    expect(snackbarSpy.success).toHaveBeenCalledWith('Vendor created successfully!');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/app/vendors');
  });

  it('should call updateVendor on valid form submission in edit mode', () => {
    component.vendorId = '1';
    component.vendorForm.setValue({
      name: 'Vendor A',
      emailId: 'vendor@example.com',
      contactNumber: '1234567890',
      address: 'Test Address'
    });

    vendorServiceSpy.updateVendor.and.returnValue(of({
      id: 1,
      name: 'Vendor A',
      emailId: 'vendor@example.com',
      contactNumber: '1234567890',
      address: 'Test Address'
    }));
    

    component.onSubmit();

    expect(vendorServiceSpy.updateVendor).toHaveBeenCalledWith('1', jasmine.any(Object));
    expect(snackbarSpy.success).toHaveBeenCalledWith('Vendor updated successfully!');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/app/vendors');
  });

  it('should mark all fields touched on invalid submit', () => {
    component.vendorForm.setValue({
      name: '',
      emailId: '',
      contactNumber: '',
      address: ''
    });

    component.onSubmit();

    expect(component.vendorForm.touched).toBeTrue();
    expect(vendorServiceSpy.createVendor).not.toHaveBeenCalled();
  });

  it('should navigate back on cancel', () => {
    component.onCancel();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/app/vendors');
  });

  it('should return required error message', () => {
    const control = component.vendorForm.get('name');
    control?.setErrors({ required: true });
    const msg = component.getErrorMessage('name');
    expect(msg).toBe('name is required.');
  });
  
  it('should return minlength error message', () => {
    const control = component.vendorForm.get('name');
    control?.setErrors({ minlength: { requiredLength: 4, actualLength: 2 } });
    const msg = component.getErrorMessage('name');
    expect(msg).toBe('name must be at least 4 characters.');
  });
  
  it('should return pattern error message', () => {
    const control = component.vendorForm.get('contactNumber');
    control?.setErrors({ pattern: true });
    const msg = component.getErrorMessage('contactNumber');
    expect(msg).toBe('contactNumber must be a valid 10-digit number.');
  });
  
  it('should return empty string for no errors', () => {
    const msg = component.getErrorMessage('address'); // address has no errors
    expect(msg).toBe('');
  });
  
  it('should access name getter', () => {
    const control = component.name;
    expect(control).toBe(component.vendorForm.get('name'));
  });
  
});
