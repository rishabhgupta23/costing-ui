
import { Component, inject, ChangeDetectorRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { PART_TABLE_COLUMNS } from '../../../../data/constants/part-table-config.constants';
import { Router } from '@angular/router';
import { PartService } from '../../../../data/services/part/part.service';
import { PartCreateRequest } from '../../../../data/models/part';
import { PageEvent } from '@angular/material/paginator';
import { TableActions } from '../../../../shared/constants/table.constants';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ColumnType } from '../../../../shared/constants/table.constants'; //new


@Component({
  selector: 'app-part-landing',
  templateUrl: './part-landing.component.html',
  styleUrl: './part-landing.component.scss'
})
export class PartLandingComponent {
  partList: PartCreateRequest[] = [];
  columns: any[] = PART_TABLE_COLUMNS;
  paginatedData: any[] = []; // Data to display on the current page
  pageSize: number = 100 // Default items per page
  currentPage: number = 0; // Current page index
  readonly dialog = inject(MatDialog);
  totalRecords: number=0;
  pageInfo: any;
  
  

  constructor(private partService: PartService, private router: Router) {
    this.getPartList();
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

  for (let i = 1; i <= maxVendorCount; i++) {
    this.columns.push({
      label: `Vendor ${i}`,
      columnType: ColumnType.GENERAL,
      key: `vendor${i}`
    });
  }
}
  
  
  createPart() {
    this.router.navigateByUrl("/app/parts/create");
  }

  handleAction(event: { action: TableActions; row:any}) {
    console.log(event.row);
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

 