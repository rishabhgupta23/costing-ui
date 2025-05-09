import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import {UserLandingComponent } from './components/user-landing/user-landing.component';
import { TableComponent } from "../../shared/components/table/table.component";
import { MatPaginatorModule } from '@angular/material/paginator';
import { UserFormComponent } from './components/user-form/user-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    UserLandingComponent,
    UserFormComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    TableComponent,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
]
})
export class SettingModule { }
