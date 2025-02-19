
import { Component, inject, ChangeDetectorRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { PART_TABLE_COLUMNS } from '../../../../data/constants/part-table-config.constants';
import { Router } from '@angular/router';
import { PartService } from '../../../../data/services/part/part.service';
import { PartCreateRequest } from '../../../../data/models/part';
import { PageEvent } from '@angular/material/paginator';
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
        console.log("Full API Response:", res);

        const responseData = res.data;
        const maxVendorCount = responseData.maxVendorCount || 0;
         this.addColumnsForVendor(maxVendorCount);

        
        this.partList = responseData.partsList.map((part: any) => {
          let vendorData: any = { ...part, vendors: part.vendorNames || [] };
  
          
          vendorData.vendors.forEach((vendor: any, index: number) => {
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

  handleAction(event: { action: string; row:any}) {
    console.log(event.row);
    const { action, row } = event;
    if (action === 'edit') {
      this.router.navigateByUrl(`/app/parts/edit/${row.partId}`);
    } else if (action === 'delete') {
      this.deletePart(row.id);
    }
  }
  deletePart(partId: string) {
    if (confirm('Are you sure you want to delete this part?')) {
      this.partService.deletePart(partId).subscribe(
        () => {
          alert('Part deleted successfully.');
          this.getPartList(); // Refresh the part list after deletion
        },
        (        error: any) => {
          console.error('Error deleting part:', error);
          alert('Failed to delete part.');
        }
      );
    }
  }
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPartList(); // Fetch data for the current page
  }

  updatePaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.partList.slice(startIndex, endIndex);
  }
}

 