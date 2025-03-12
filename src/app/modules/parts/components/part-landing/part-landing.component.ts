
import { Component, OnInit, inject} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { PART_TABLE_COLUMNS } from '../../../../data/constants/part-table-config.constants';
import { Router } from '@angular/router';
import { PartService } from '../../../../data/services/part/part.service';
import { PartRow, SortState } from '../../../../data/models/part';
import { PageEvent } from '@angular/material/paginator';
import { SortIcons, TableActions } from '../../../../shared/constants/table.constants';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ColumnType } from '../../../../shared/constants/table.constants';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SnackbarService } from '../../../../data/services/snackbar/snackbar.service';


@Component({
  selector: 'app-part-landing',
  templateUrl: './part-landing.component.html',
  styleUrl: './part-landing.component.scss'
})
export class PartLandingComponent implements OnInit {
  partList: PartRow[] = [];
  columns: any[] = PART_TABLE_COLUMNS;
  pageSize: number = 100; // Default items per page
  currentPage: number = 0; // Current page index
  readonly dialog = inject(MatDialog);
  totalRecords: number=0;
  pageInfo: any;
  filterCriteria: Map<string, string> = new Map();
  private searchSubject = new Subject<{ key: string; value: string }>();
  sortState: SortState = {sortColumn: 'partNumber', sortState: SortIcons.ASC}

  constructor(private partService: PartService, private router: Router, private snackbarService: SnackbarService) {}
  
  ngOnInit(): void {
    this.getPartList();
    this.listenToFilterChanges();
  }

  onRowClicked(rowData: any) {
    this.router.navigateByUrl(`/app/parts/view/${rowData.partId}`);
  }
  
  getPartList() {
    this.partService.getPartList(this.currentPage, this.pageSize, this.filterCriteria, this.sortState).subscribe(
      (res) => {
        const responseData = res.data;
        const maxVendorCount = responseData.maxVendorCount || 0;
        this.addColumnsForVendor(maxVendorCount);
        
        this.partList = responseData.partsList.map((part: any) => {
          let vendorData: any = { ...part };
  
        (part.vendorNames || []).forEach((vendor: any, index: number) => {
          vendorData[`vendor${index + 1}`] = vendor;
        });

        return vendorData;
      });

        this.totalRecords = res.pageInfo?.totalRecords || this.partList.length;
      },
      (error) => {
        console.error("Error fetching part list:", error);
      }
    );
  }
  addColumnsForVendor(maxVendorCount: number) {
  this.columns = [...PART_TABLE_COLUMNS];

    for (let i = 1; i <= maxVendorCount; i++) {
      this.columns.splice(this.columns.length-1,0,{
        label: `Vendor ${i}`,
        columnType: ColumnType.GENERAL,
        key: `vendor${i}`
      })
    }
  }


  listenToFilterChanges(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => prev.value === curr.value)
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.getPartList();
      });
  }
  

  
  applyFilter(filter: { key: string; value: string }): void {
    this.filterCriteria.set(filter.key, filter.value);
    this.searchSubject.next(filter);
  }

  applySort(sort: SortState): void {
    this.sortState = sort;
    this.getPartList();
  }


  downloadExcel() {
    this.partService.downloadExcel().subscribe(response => {
      const base64String = response.fileData;
      const fileName = response.fileName || 'partList.xlsx';

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

  createPart() {
    this.router.navigateByUrl("/app/parts/create");
  }

  handleAction(event: { action: TableActions; row:any}) {
    const { action, row } = event;
    if (action === TableActions.EDIT) {
      this.router.navigateByUrl(`/app/parts/edit/${row.partId}`);
    } else if (action === TableActions.DELETE) {
      const dialogData: ConfirmDialogData = {
        title: 'Delete Part',
        message: 'Are you sure you want to delete this part?'
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: dialogData });

      dialogRef.afterClosed().subscribe(result => {
        if (result === DialogCloseResponse.DELETE) {
          this.deletePart(row.partId);
        }
      });
    }

  }
  deletePart(partId: string) {

    this.partService.deletePart(partId).subscribe({
      next: () => {
        this.getPartList();
        this.snackbarService.show('Part deleted successfully', 'success');
        }
      });
  }
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPartList();
  }

}

 