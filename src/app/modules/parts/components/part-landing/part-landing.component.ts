
import { AfterViewInit, Component,ChangeDetectorRef, OnInit, ViewChild, inject} from '@angular/core';
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

@Component({
  selector: 'app-part-landing',
  templateUrl: './part-landing.component.html',
  styleUrl: './part-landing.component.scss'
})
export class PartLandingComponent implements OnInit, AfterViewInit {
  partList: PartCreateRequest[] = [];
  filteredData: PartCreateRequest[] = []; 
  columns: any[] = PART_TABLE_COLUMNS;
  paginatedData: any[] = []; // Data to display on the current page
  pageSize: number = 100 // Default items per page
  currentPage: number = 0; // Current page index
  readonly dialog = inject(MatDialog);
  totalRecords: number=0;
  pageInfo: any;
  filterCriteria: { [key: string]: string } = {};
  @ViewChild(TableComponent) tableComponent!: TableComponent;

  constructor(private partService: PartService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getPartList();
  }

  ngAfterViewInit(): void {
    // Set the default sort for the shared table component after view initialization.
    if (this.tableComponent) {
      this.tableComponent.sortedColumn = 'partNumber';
      this.tableComponent.sortedOrder = 'asc';
      // Optionally, emit the sort event so that the part landing component can trigger an API call.
      this.tableComponent.sortChanged.emit({ key: 'partNumber', order: 'asc' });
      this.cd.detectChanges();
    }
  }

  
  getPartList() {
    this.partService.getPartList(this.currentPage, this.pageSize).subscribe(
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

        this.filteredData = [...this.partList];
        this.updatePaginatedData();
        this.paginatedData = this.partList;
        this.totalRecords = responseData.pageInfo?.totalRecords || 0;
      },
      (error) => {
        console.error("Error fetching part list:", error);
      }
    );
  }
  addColumnsForVendor(maxVendorCount: number) {
  this.columns = [...PART_TABLE_COLUMNS];

  const actionsIndex = this.columns.findIndex(col => col.columnType === ColumnType.ACTION);

    for (let i = 1; i <= maxVendorCount; i++) {
      this.columns.splice(actionsIndex, 0,{
        label: `Vendor ${i}`,
        columnType: ColumnType.GENERAL,
        key: `vendor${i}`,
        filterable: true,
        sortable: true
      });
    }
  }
  
  applyFilter(filter: { key: string; value: string }): void {
    console.log(`API call: Fetch filtered data for ${filter.key} with filter value: "${filter.value}"`);
    // When backend API is ready:
    // this.partService.getFilteredPartList(filter.key, filter.value).subscribe({
    //   next: (res) => {
    //     this.partList = res.data;
    //     this.filteredData = [...this.partList];
    //     this.updatePaginatedData();
    //   },
    //   error: (err) => console.error('Filtering API error:', err)
    // });
  }

  applySort(sort: { key: string; order: string }): void {
    if (!sort.order) return;

    console.log(`API call: Fetch sorted data for ${sort.key} in ${sort.order} order.`);
    
    // Simulate an API call:
    // For now, we'll simply log to the console.
    // When your API is ready, call:
    // this.partService.getSortedPartList(sort.key, sort.order).subscribe({...});
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
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }
}

 