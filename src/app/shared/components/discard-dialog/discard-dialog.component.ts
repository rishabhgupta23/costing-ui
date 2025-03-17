import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Vendor } from '../../../data/models/vendor';
import { DialogCloseResponse } from '../../constants/dialog.constants';
import { DISCARD_TABLE_COLUMNS } from '../../constants/discard.constant';
import { TableComponent } from '../table/table.component';
import { InfoDialogComponent } from '../infodialog/infodialog.component';
import { VendorService } from '../../../data/services/vendor/vendor.service';
import { PartRow } from '../../../data/models/part';

@Component({
  selector: 'app-discard-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, MatPaginatorModule, TableComponent],
  templateUrl: './discard-dialog.component.html',
  styleUrls: ['./discard-dialog.component.scss'],
})
export class DiscardDialogComponent implements OnInit {
  columns = DISCARD_TABLE_COLUMNS;
  partList: PartRow[] = [];
  dataSource: any[] = []; // Storing data from API
  totalRecords = 0;
  currentPage = 0;
  pageSize = 100;
  pageInfo: any;
  hasParts: boolean = false;
  public DialogCloseResponse = DialogCloseResponse

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private vendorService: VendorService,
    public dialogRef: MatDialogRef<DiscardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { row: Vendor },
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.row.id) {
      this.fetchData(this.data.row.id, this.currentPage, this.pageSize);
    } else {
      this.dialog.open(InfoDialogComponent, {
        width: '400px',
        data: {
          title: 'Error',
          message: 'No vendorId provided to the dialog.'
        }
      });
    }
  }

  fetchData(vendorId: number, currentPage: number, pageSize: number) {
    this.vendorService.getVendorParts(vendorId, currentPage, pageSize).subscribe(res => {
      this.dataSource = res;
      this.totalRecords = res.pageInfo?.totalRecords || this.dataSource.length;
      this.hasParts = this.dataSource.length > 0;
    });
}

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchData(this.data.row.id, this.currentPage, this.pageSize);
  }

  closeDialog(result: DialogCloseResponse): void {
    this.dialogRef.close(result);
  }
}
