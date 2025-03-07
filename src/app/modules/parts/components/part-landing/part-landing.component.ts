
import { AfterViewInit, Component, OnInit, ViewChild, inject} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { PART_TABLE_COLUMNS } from '../../../../data/constants/part-table-config.constants';
import { Router } from '@angular/router';
import { PartService } from '../../../../data/services/part/part.service';
import { PartCreateRequest } from '../../../../data/models/part';
import { PageEvent } from '@angular/material/paginator';
import { TableActions } from '../../../../shared/constants/table.constants';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ColumnType } from '../../../../shared/constants/table.constants';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-part-landing',
  templateUrl: './part-landing.component.html',
  styleUrl: './part-landing.component.scss'
})
export class PartLandingComponent implements OnInit, AfterViewInit {
  partList: PartCreateRequest[] = [];
  columns: any[] = PART_TABLE_COLUMNS;
  paginatedData: any[] = []; // Data to display on the current page
  pageSize: number = 100; // Default items per page
  currentPage: number = 0; // Current page index
  readonly dialog = inject(MatDialog);
  totalRecords: number=0;
  pageInfo: any;
  @ViewChild(TableComponent) tableComponent!: TableComponent;
  filterCriteria: Map<string, string> = new Map();
  private searchSubject = new Subject<{ key: string; value: string }>();
  sortColumn: string = 'partNumber';
  sortMode: string = 'ASC';

  constructor(private partService: PartService, private router: Router) {}

  ngOnInit(): void {
    this.getPartList();
    this.listenToFilterChanges();
  }

  ngAfterViewInit(): void {
    if (this.tableComponent) {
      this.tableComponent.sortedColumn = 'partNumber';
      this.tableComponent.sortedOrder = 'asc';
      this.tableComponent.sortChanged.emit({ key: 'partNumber', order: 'asc' });
    }
  }

  
  getPartList() {
    this.partService.getPartList(this.currentPage, this.pageSize, this.filterCriteria, this.sortColumn, this.sortMode).subscribe(
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
        this.updatePaginatedData();
      },
      (error) => {
        console.error("Error fetching part list:", error);
      }
    );
  }
  addColumnsForVendor(maxVendorCount: number) {
  this.columns = [...PART_TABLE_COLUMNS];

  const actionsIndex = this.columns.findIndex(col => col.columnType === ColumnType.ACTION);

    for (let i = maxVendorCount; i >= 1; i--) {
      this.columns.splice(actionsIndex, 0,{
        label: `Vendor ${i}`,
        columnType: ColumnType.GENERAL,
        key: `vendor${i}`
      });
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
        this.getPartList(); // ✅ Reusing existing method
      });
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
    this.getPartList();
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

    this.partService.deletePart(partId).subscribe(() => {
      this.getPartList();
      
    });
    
  }
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPartList();
  }

  updatePaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.partList.slice(startIndex, endIndex);
  }
}

 