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
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { BomdialogComponent } from './components/bomdialog/bomdialog.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PartViewComponent } from './components/part-view/part-view.component';
import { HistorydialogComponent } from './components/historydialog/historydialog.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, MAT_AUTOCOMPLETE_SCROLL_STRATEGY, MatAutocompleteDefaultOptions, MatAutocompleteModule } from '@angular/material/autocomplete';
import { Overlay, OverlayModule, ScrollStrategy } from '@angular/cdk/overlay';


const customAutocompleteDefaults: MatAutocompleteDefaultOptions = {
  overlayPanelClass: 'app-autocomplete-overlay'
};

@NgModule({
  declarations: [ PartLandingComponent, PartsFormComponent, BomdialogComponent, PartViewComponent, HistorydialogComponent],
  imports: [
    CommonModule,
    PartsRoutingModule,
    TableComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    MatSnackBarModule,
    MatStepperModule,
    MatAutocompleteModule,
    OverlayModule
  ],
  providers: [
    {
      provide: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS,
      useValue: customAutocompleteDefaults
    }
  ]
})
export class PartsModule { }
