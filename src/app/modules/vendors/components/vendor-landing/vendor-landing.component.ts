import { Component, inject, AfterViewInit, OnInit, ViewChild} from '@angular/core';
import { Vendor } from '../../../../data/models/vendor';
import { VENDOR_TABLE_COLUMNS } from '../../../../data/constants/vendor-table-config.constants';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { DiscardDialogComponent } from '../../../../shared/components/discard-dialog/discard-dialog.component';
import { TableActions } from '../../../../shared/constants/table.constants';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TableComponent } from '../../../../shared/components/table/table.component';
@Component({
  selector: 'app-vendor-landing',
  templateUrl: './vendor-landing.component.html',
  styleUrls: ['./vendor-landing.component.scss']
})

export class VendorLandingComponent implements OnInit {
  vendorList: Vendor[] = [];
 
  columns: any[] = VENDOR_TABLE_COLUMNS;
  paginatedData: any[] = []; // Data to display on the current page
  pageSize: number = 100; // Default items per page
  currentPage: number = 0; // Current page index
  totalRecords: number=0;
  pageInfo: any;
  readonly dialog = inject(MatDialog);
  filterCriteria: Map<string, string> = new Map();
  
  private searchSubject = new Subject<{ key: string; value: string }>();
  sortColumn: string = 'name';
  sortMode: string = 'ASC';
  
  
  constructor(private vendorService: VendorService, private router: Router) {}

  ngOnInit(): void {
    this.getVendorList();
    this.listenToFilterChanges();
  }
  

  getVendorList(): void {
    this.vendorService.getVendorList(this.currentPage, this.pageSize, this.filterCriteria).subscribe(
      (res) => {
        this.vendorList = res.data;
        this.totalRecords = res.pageInfo?.totalRecords || 0;
      }
    );
  }

listenToFilterChanges(): void {
  this.searchSubject
    .pipe(
      debounceTime(300), 
      distinctUntilChanged((prev, curr) => prev.value === curr.value), // Ignore duplicate searches
      switchMap(() =>{
        this.currentPage=0;
        return this.vendorService.getVendorList(this.currentPage, this.pageSize,this.filterCriteria);
      })
    )
    .subscribe(
      (res) => {
        this.vendorList = res.data;
        this.totalRecords = res.pageInfo?.totalRecords || 0;
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
  
  applySort(sort: { key: string; order: string }): void {
    if (!sort.order) return;
    this.sortColumn = sort.key;
    this.sortMode = sort.order.toUpperCase();
    //console.log(`API call: Fetch sorted data for ${this.sortColumn} in ${this.sortMode} order.`);
    this.getVendorList();
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

  downloadExcel() {
    this.vendorService.downloadExcel().subscribe(response => {
      const base64String = response.fileData;
      const fileName = response.fileName || 'vendorList.xlsx';

      const byteArray = new Uint8Array([...atob(base64String)].map(char => 
        char.charCodeAt(0)
      ));
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    });
  }


  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getVendorList();
  }

  updatePaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.vendorList.slice(startIndex, endIndex);
  }
}
