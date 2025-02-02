import { Component, inject } from '@angular/core';
import { Vendor } from '../../../../data/models/vendor';
import { VENDOR_TABLE_COLUMNS } from '../../../../data/constants/vendor-table-config.constants';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-landing',
  templateUrl: './vendor-landing.component.html',
  styleUrl: './vendor-landing.component.scss'
})
export class VendorLandingComponent {
  vendorList: Vendor[] = [];
  columns: any[] = VENDOR_TABLE_COLUMNS;
  readonly dialog = inject(MatDialog);

  constructor(private vendorService: VendorService, private router: Router) {
    this.getVendorList();
  }

  getVendorList() {
    this.vendorService.getVendorList().subscribe(res => {
      this.vendorList = res;
    });
  }

  openCreateVendorDialog() {
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

  createVendor() {
    this.router.navigateByUrl("/app/vendors/create");
  }

  handleAction(event: { action: string; row: any }) {
    const { action, row } = event;
    if (action === 'edit') {
      this.router.navigateByUrl(`/app/vendors/edit/${row.id}`);
    }else if (action === 'delete') {
      this.deleteVendor(row.id);
    }
  }
  deleteVendor(vendorId: string) {
    if (confirm('Are you sure you want to delete this vendor?')) {
      this.vendorService.deleteVendor(vendorId).subscribe(() => {
        alert('Vendor deleted successfully.');
        this.getVendorList();
      }, (error: any) => {
        console.error('Error deleting vendor:', error);
        alert('Failed to delete vendor.');
      });
    }
  }
}
