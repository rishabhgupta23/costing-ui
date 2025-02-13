import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { PART_TABLE_COLUMNS } from '../../../../data/constants/part-table-config.constants';
import { Router } from '@angular/router';
import { PartService } from '../../../../data/services/part/part.service';
import { PartCreateRequest } from '../../../../data/models/part';
import { PageEvent } from '@angular/material/paginator';
import { TableActions } from '../../../../shared/constants/table.constants';


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
        console.log(res)
        this.partList = res.data;
        this.paginatedData = this.partList; // Set the current page's data
        this.totalRecords = res.pageInfo.totalElements;
        console.log(this.totalRecords)
      },
      (error) => {
        console.error('Error fetching parts:', error);
      }
    );
  }

  createPart() {
    this.router.navigateByUrl("/app/parts/create");
  }

  handleAction(event: { action: TableActions; row: any }) {
    console.log(event.row);
    const { action, row } = event;
    if (action === TableActions.EDIT) {
      this.router.navigateByUrl(`/app/parts/edit/${row.partId}`);
    } else if (action === TableActions.DELETE) {
      this.deletePart(row.partId);
    }
  }
  deletePart(partId: string) {
    if (confirm('Are you sure you want to delete this part?')) {
      this.partService.deletePart(partId).subscribe(
        () => {
          alert('Part deleted successfully.');
          this.getPartList(); // Refresh the part list after deletion
        },
        (error: any) => {
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
