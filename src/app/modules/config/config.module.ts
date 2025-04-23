import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigRoutingModule } from './config-routing.module';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { CategoryComponent } from './components/category/category.component';
import { ConfigLandingComponent } from './components/config-landing/config-landing.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [CategoryComponent, ConfigLandingComponent],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    TableComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginatorModule,
    FormsModule
  ]
})
export class ConfigModule { }
