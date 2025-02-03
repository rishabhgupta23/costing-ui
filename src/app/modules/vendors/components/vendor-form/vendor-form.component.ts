import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { Vendor } from '../../../../data/models/vendor';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.scss'],
})
export class VendorFormComponent implements OnInit {
  vendorId: string | null = null;
  vendorForm = new FormGroup({
    name: new FormControl('',[
      Validators.required,
      Validators.minLength(4),
    ]),
    emailId: new FormControl('', [Validators.email]),
    contactNumber: new FormControl('',[
      Validators.required,
      Validators.pattern('^[0-9]{10}$'),
    ]),
    address: new FormControl('') 
  });

  constructor(
    private vendorService: VendorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    // Capture the vendorId from the URL
    this.vendorId = this.route.snapshot.paramMap.get('id'); 

    // Initialize the form with empty values
    this.vendorForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      emailId: new FormControl(''),
      contactNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$'),
      ]),
      address: new FormControl(''),
    });

    // If in edit mode (vendorId exists), fetch and populate form with vendor data
    if (this.vendorId) {
      this.getVendorData(this.vendorId);
    }
  }

  getVendorData(id: string): void {
    // Fetch the vendor data by ID
    this.vendorService.getVendorById(id).subscribe((vendor: Vendor) => {
      // Populate the form fields with the existing vendor data
      this.vendorForm.patchValue({
        name: vendor.name,
        emailId: vendor.emailId,
        contactNumber: vendor.contactNumber,
        address: vendor.address,
      });
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.vendorForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName} is required.`;
    }
    if (control?.hasError('minlength')) {
      return `${controlName} must be at least ${control.getError('minlength').requiredLength} characters.`;
    }
    if (control?.hasError('pattern')) {
      return `${controlName} must be a valid 10-digit number.`;
    }
    return '';
  }

  get name() {
    return this.vendorForm.get('name');
  }

  onCancel() {
    this.router.navigateByUrl('/app/vendors'); // Navigate back to the vendor list
  }

  onSubmit() {
    if (this.vendorForm.valid) {
      if (this.vendorId) {
        // If vendorId exists, update the vendor
        this.vendorService.updateVendor(this.vendorId, this.vendorForm.value as Vendor).subscribe(() => {
          this.router.navigateByUrl('/app/vendors');
        });
      } else {
        this.vendorService.createVendor(this.vendorForm.value as Vendor).subscribe(() => {
          this.router.navigateByUrl('/app/vendors');
        });
      }
    } else {
      this.vendorForm.markAllAsTouched();
    }
  }
}