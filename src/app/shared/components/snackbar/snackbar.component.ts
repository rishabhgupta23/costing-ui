import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import {CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  standalone:true,
  imports:[CommonModule, MatIconModule],
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string; type: string }
  ) {}
}