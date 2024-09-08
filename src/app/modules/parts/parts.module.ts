import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartsRoutingModule } from './parts-routing.module';
import { TableComponent } from '../../shared/components/table/table.component';
import { PartLandingComponent } from './components/part-landing/part-landing.component';
import { PartsFormComponent } from './components/parts-form/parts-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';


@NgModule({
  declarations: [ PartLandingComponent, PartsFormComponent],
  imports: [
    CommonModule,
    PartsRoutingModule,
    TableComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule
  ]
})
export class PartsModule { }
