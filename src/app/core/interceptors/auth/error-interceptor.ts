import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../../../shared/components/infodialog/infodialog.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        const errorTitle = `Error ${error.status}${error.statusText ? ' - ' + error.statusText : ''}`;

        const errorMessage = error.error?.message || 'An unexpected error occurred.';

        this.dialog.open(InfoDialogComponent, {
          width: '400px',
          data: { 
            title: errorTitle,
            message: errorMessage
          }
        });

        return throwError(() => error);
      })
    );
  }
}
