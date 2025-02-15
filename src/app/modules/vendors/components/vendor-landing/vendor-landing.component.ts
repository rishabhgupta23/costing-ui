import { Component, inject, EventEmitter, Output } from '@angular/core';
import { Vendor } from '../../../../data/models/vendor';
import { VENDOR_TABLE_COLUMNS } from '../../../../data/constants/vendor-table-config.constants';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { Router } from '@angular/router';
import { DiscardDialogComponent } from '../../../../shared/components/discard-dialog/discard-dialog.component';
import { TableActions } from '../../../../shared/constants/table.constants';
import { InfoDialogComponent } from '../../../../shared/components/infodialog/infodialog.component';
@Component({
  selector: 'app-vendor-landing',
  templateUrl: './vendor-landing.component.html',
  styleUrls: ['./vendor-landing.component.scss']
})

export class VendorLandingComponent {
  vendorList: Vendor[] = [];
  columns: any[] = VENDOR_TABLE_COLUMNS;
  readonly dialog = inject(MatDialog);

  @Output() actionTriggered = new EventEmitter<{ action: string; row: any }>();

  constructor(private vendorService: VendorService, private router: Router) {
    this.getVendorList();
  }

  getVendorList(): void {
    this.vendorService.getVendorList().subscribe({
      next: (res) => {
        this.vendorList = res;
      },
      error: (err: any) => {
        console.error('Failed to fetch vendors:', err);
        this.dialog.open(InfoDialogComponent, {
          width: '400px',
          data: {
            title: `Fetch Error `,
            message: 'Failed to fetch vendors. ' + (err?.error?.message || 'An unexpected error occurred.'),
            status: err.status
          }
        });
      }
    });
  }
  

  openCreateVendorDialog(): void {
    // Implementation for opening the create vendor dialog
    // For example:
    // const dialogRef = this.dialog.open(VendorDialogComponent, {
    //   panelClass: ['app-dialog'],
    //   disableClose: true
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result == DialogCloseResponse.CREATE) {
    //     this.getVendorList();
    //   }
    // });
  }

  createVendor(): void {
    this.router.navigateByUrl('/app/vendors/create');
  }

  handleAction(event: { action: TableActions; row: any }): void {
    const { action, row } = event;

    if (action === TableActions.DELETE) {
      this.openDiscardDialog(row);
    } else if (action === TableActions.EDIT) {
      this.router.navigateByUrl(`/app/vendors/edit/${row.id}`);
    } else {
      this.actionTriggered.emit({ action, row });
    }
  }

  openDiscardDialog(row: any): void {
    const dialogRef = this.dialog.open(DiscardDialogComponent, {
      width: '600px',
      data: {
        row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === DialogCloseResponse.DELETE) {
        this.vendorService.deleteVendor(row.id.toString()).subscribe({
          next: () => {
            this.getVendorList();
            // this.dialog.open(InfoDialogComponent, {
            //   width: '400px',
            //   data: { 
            //     title: 'Deletion Successful', 
            //     message: 'Vendor deleted successfully' 
            //   }
            // });
          },
          error: (error: any) => {
            this.dialog.open(InfoDialogComponent, {
              width: '400px',
              data: { 
                title: `Fetch Error (Status: ${error.status})`,
                message: 'Failed to delete vendor. ' + (error?.error?.message || 'An unexpected error occurred.')
              }
            });
          }
        });
      }
    });
  }

  editRow(row: any): void {
    this.router.navigateByUrl(`/app/vendors/edit/${row.partId}`);
  }

  
  deleteVendor(vendorId: string): void {
    if (confirm('Are you sure you want to delete this vendor?')) {
      this.vendorService.deleteVendor(vendorId).subscribe(
        () => {
          alert('Vendor deleted successfully.');
          this.getVendorList();
        },
        (error: any) => {
          console.error('Error deleting vendor:', error);
          alert('Failed to delete vendor.');
        }
      );
    }
  }
}
