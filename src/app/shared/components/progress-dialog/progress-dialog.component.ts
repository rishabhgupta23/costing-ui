import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-progress-dialog',
  standalone: true,
  templateUrl: './progress-dialog.component.html',
  imports: [MatDialogModule,
    MatStepperModule,
    MatProgressSpinnerModule, CommonModule],
  styleUrl: './progress-dialog.component.scss'
})
export class ProgressDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { step: number }) {}
}
