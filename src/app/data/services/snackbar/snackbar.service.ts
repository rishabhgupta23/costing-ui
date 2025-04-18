import { Injectable } from '@angular/core';
import { SnackbarComponent } from '../../../shared/components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, type: 'success' | 'warning' | 'error') {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message, type },
      duration:  1000,
      panelClass: type,
      verticalPosition: 'top'
    });
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }
}
