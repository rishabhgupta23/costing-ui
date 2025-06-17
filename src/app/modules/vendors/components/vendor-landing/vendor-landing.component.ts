import { Component, inject, EventEmitter, Output} from '@angular/core';
import { Vendor } from '../../../../data/models/vendor';
import { VENDOR_TABLE_COLUMNS } from '../../../../data/constants/vendor-table-config.constants';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { DiscardDialogComponent } from '../../../../shared/components/discard-dialog/discard-dialog.component';
import { SortIcons, TableActions } from '../../../../shared/constants/table.constants';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { downloadFile } from '../../../../shared/utils/file-download.util';
import { SnackbarService } from '../../../../data/services/snackbar/snackbar.service';
import { SortState } from '../../../../data/models/part';
import { getValueOrNull } from '../../../../shared/utils/string.util';

@Component({
  selector: 'app-vendor-landing',
  templateUrl: './vendor-landing.component.html',
  styleUrls: ['./vendor-landing.component.scss']
})

export class VendorLandingComponent  {
  vendorList: Vendor[] = [];
 
  columns: any[] = VENDOR_TABLE_COLUMNS;
  pageSize: number = 100; // Default items per page
  currentPage: number = 0; // Current page index
  totalRecords: number=0;
  pageInfo: any;
  readonly dialog = inject(MatDialog);
  filterCriteria: Map<string, string> = new Map();
  sortState: SortState = {sortColumn: 'vendorName', sortState: SortIcons.ASC}
  
  private searchSubject = new Subject<{ key: string; value: string }>(); 
  
  
  constructor(private vendorService: VendorService, private router: Router, private snackbarService:SnackbarService) {
    this.getVendorList();
    this.listenToFilterChanges(); 
  }

  getVendorList(): void {
    this.vendorService.getVendorList(this.currentPage, this.pageSize, this.filterCriteria, this.sortState).subscribe(
      (res) => {
        this.vendorList = res.data;
        this.totalRecords = getValueOrNull(res.pageInfo?.totalRecords);
      }
    );
  }

listenToFilterChanges(): void {
  this.searchSubject
    .pipe(
      debounceTime(300), 
      distinctUntilChanged((prev, curr) => prev.value === curr.value), // Ignore duplicate searches
    )
    .subscribe(
      (res) => {
        this.currentPage = 0;
        this.getVendorList();
      }
    );
}


  createVendor() {
    this.router.navigateByUrl("/app/vendors/create");
  }
  
 applyFilter(filter: { key: string; value: string }): void {
  this.filterCriteria.set(filter.key, filter.value);
  this.searchSubject.next(filter);
  }

  applySort(sort: SortState): void {
    this.sortState = sort;
    this.getVendorList();
  }
  
  openDiscardDialog(row: any): void {
    const dialogRef = this.dialog.open(DiscardDialogComponent, {
      width: '37.5rem',
      data: {
        row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === DialogCloseResponse.DELETE) {
        this.vendorService.deleteVendor(row.id.toString()).subscribe({
          next: () => {
            this.snackbarService.success('Vendor deleted successfully!');
            this.getVendorList(); 
             },
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

  downloadExcel() {
    this.vendorService.downloadExcel().subscribe(response => {
      downloadFile(response.fileData,response.fileName || 'vendorList.xlsx')
    });
  }


  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getVendorList();
  }

}
