import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalculateRoutingModule } from './calculate-routing.module';
import { ComponentsComponent } from './components/components.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';


@NgModule({
  declarations: [
    ComponentsComponent
  ],
  imports: [
    CommonModule,
    CalculateRoutingModule,
    TableComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule
  ]
})
export class CalculateModule { }