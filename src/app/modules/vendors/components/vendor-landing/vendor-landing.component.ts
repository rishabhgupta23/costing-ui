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
  filteredVendorList: Vendor[] | undefined;
  filteredData: any[] = []; 
  filterCriteria: { [key: string]: string } = {};
  
  
  constructor(private vendorService: VendorService, private router: Router) {
    this.getVendorList();
  }

  isLoading: boolean = false;

getVendorList() {
  this.isLoading = true;
  this.vendorService.getVendorList().subscribe(
    (res : Vendor[]) => {
      this.vendorList =  res;
        this.filteredData = [...this.vendorList];
        this.isLoading = false;

    },
    (error) => {
      console.error('Failed to fetch vendor list:', error);
      alert('Failed to load vendors. Please try again later.');
      this.isLoading = false;
    }
  );
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

 
  

  applyFilter(filter: { key: string; value: string }): void {
    this.filterCriteria[filter.key] = filter.value.trim().toLowerCase();
  
    this.filteredData = this.vendorList.filter(item =>
      Object.keys(this.filterCriteria).every(k =>
        (item as any)[k]?.toString().toLowerCase().includes(this.filterCriteria[k])
      )
    );
  }

  
  
  
  clearFilter(filterInput: HTMLInputElement, key: string): void {
    filterInput.value = ''; // Clear input field
    delete this.filterCriteria[key]; // Remove filter from criteria
  
    // Reapply filtering
    this.filteredData = this.vendorList.filter(item =>
      Object.keys(this.filterCriteria).every(k =>
        (item as any)[k]?.toString().toLowerCase().includes(this.filterCriteria[k])
      )
    );
  }
  
  



  /*applyFilter(filter: { key: string; value: string }): void {
    console.log('Filter applied:', filter);
    const { key, value } = filter;
    this.filterCriteria[key] = value.trim().toLowerCase();

    this.filteredData = this.vendorList.filter(item =>
      Object.keys(this.filterCriteria).every(k =>
        this.filterCriteria[k] === '' || 
        (item as any)[k]?.toString().toLowerCase().includes(this.filterCriteria[k])
      )
    );
    console.log('Filtered Data:', this.filteredData); 
  }

  */

  

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
