import { Injectable } from '@angular/core';
import { SnackbarComponent } from '../../../shared/components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, type: 'success' | 'warning' | 'error',
    verticalPosition: 'top' | 'bottom' = 'top',
  ) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message, type },
      duration: 1000,
      panelClass: type,
      verticalPosition
    });
  }
}
