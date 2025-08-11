import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { DialogCloseResponse } from 'src/app/shared/constants/dialog.constants';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveProductionPlanGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(private dialog: MatDialog) {}

  canDeactivate(): Observable<boolean> {
    const dialogData: ConfirmDialogData = {
      title: 'Leave Page?',
      message: 'Are you sure you want to leave the Production Plan?'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: dialogData });

    return new Observable<boolean>((observer) => {
      dialogRef.afterClosed().subscribe(result => {
        observer.next(result === DialogCloseResponse.DELETE);
        observer.complete();
      });
    });
  }
}
