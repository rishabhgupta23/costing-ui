import { Component, inject, EventEmitter, Output} from '@angular/core';
import { Vendor } from '../../../../data/models/vendor';
import { VENDOR_TABLE_COLUMNS } from '../../../../data/constants/vendor-table-config.constants';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { Router } from '@angular/router';
import { DiscardDialogComponent } from '../../../../shared/components/discard-dialog/discard-dialog.component';
import { TableActions } from '../../../../shared/constants/table.constants';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-vendor-landing',
  templateUrl: './vendor-landing.component.html',
  styleUrls: ['./vendor-landing.component.scss']
})

export class VendorLandingComponent  {
  vendorList: Vendor[] = [];
 
  columns: any[] = VENDOR_TABLE_COLUMNS;
  readonly dialog = inject(MatDialog);
  filterCriteria: { [key: string]: string } = {};
  
  private searchSubject = new Subject<{ key: string; value: string }>(); 
  
  
  constructor(private vendorService: VendorService, private router: Router) {
    this.getVendorList();
    this.listenToFilterChanges(); 
   /* this.searchSubject
      .pipe(
        debounceTime(300), 
        distinctUntilChanged((prev, curr) => prev.value === curr.value), // Ignore duplicate searches
        switchMap((filter) => this.vendorService.getVendorList({ [filter.key]: filter.value }))
      )
      .subscribe(
        (res: Vendor[]) => {
          this.vendorList = res;
          
        }
        
      );*/
  }

getVendorList() {
  
  this.vendorService.getVendorList().subscribe(
    (res : Vendor[]) => {
      this.vendorList =  res;
  }
    
  );
}

listenToFilterChanges(): void {
  this.searchSubject
    .pipe(
      debounceTime(300), 
      distinctUntilChanged((prev, curr) => prev.value === curr.value), // Ignore duplicate searches
      switchMap((filter) => this.vendorService.getVendorList({ [filter.key]: filter.value }))
    )
    .subscribe(
      (res: Vendor[]) => {
        this.vendorList = res;
        console.log('Filtered Data:', this.vendorList);
      },
      (error) => {
        console.error('Error fetching filtered vendors:', error);
      }
    );
}


  createVendor() {
    this.router.navigateByUrl("/app/vendors/create");
  }
  
 applyFilter(filter: { key: string; value: string }): void {
    this.searchSubject.next(filter); // Push filter change to subject
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
            this.getVendorList();  },
        });
      }
    });
  }

  handleAction(event: { action: TableActions; row: any }): void {
    const { action, row } = event;

    if (action === TableActions.DELETE) {
      this.openDiscardDialog(row);
    } else if (action === TableActions.EDIT) {
      this.router.navigateByUrl(`/app/vendors/edit/${row.id}`);
    }
  }
  }
