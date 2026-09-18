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
import { PartAttributeComponent } from './components/part-attribute/part-attribute.component';
import { PartTemplateComponent } from './components/part-template/part-template.component';
import { TemplateDialogComponent} from './components/template-dialog/template-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CostFactorComponent } from './components/cost-factor/cost-factor.component';


@NgModule({
  declarations: [CategoryComponent, ConfigLandingComponent, PartAttributeComponent, PartTemplateComponent, TemplateDialogComponent,CostFactorComponent],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    TableComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginatorModule,
    FormsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTableModule,
    MatIconModule
  ]
})
export class ConfigModule { }
