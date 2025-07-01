import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolsRoutingModule } from './tools-routing.module';
import { CalculateComponent } from './components/calculate/calculate.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import{MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ProductionPlanComponent } from './components/production-plan/production-plan.component';
import { ToolsDashboardComponent } from './components/tools-dashboard/tools-dashboard.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';


@NgModule({
  declarations: [
    CalculateComponent,
    ProductionPlanComponent,
    ToolsDashboardComponent
  ],
  imports: [
    CommonModule,
    ToolsRoutingModule,
    TableComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
    MatPaginatorModule, 
    MatStepperModule,
  ]
})
export class ToolsModule { }
