import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { Vendor } from '../../../../data/models/vendor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrl: './vendor-form.component.scss'
})
export class VendorFormComponent {

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

  constructor(private vendorService: VendorService, private router: Router) {}

  onCancel() {
  }

  onCreate() {
    this.vendorService.createVendor(this.vendorForm.value as Vendor).subscribe(() => {
      this.router.navigateByUrl("/app/vendors");
    });
  }

}
