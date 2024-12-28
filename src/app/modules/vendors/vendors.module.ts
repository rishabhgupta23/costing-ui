import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorsRoutingModule } from './vendors-routing.module';
import { VendorLandingComponent } from './components/vendor-landing/vendor-landing.component';
import { TableComponent } from '../../shared/components/table/table.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { VendorFormComponent } from './components/vendor-form/vendor-form.component';


@NgModule({
  declarations: [VendorLandingComponent, VendorFormComponent],
  imports: [
    CommonModule,
    VendorsRoutingModule,
    TableComponent,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
]
})
export class VendorsModule { }
