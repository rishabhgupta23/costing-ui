import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { Vendor } from '../../../data/models/vendor';
import { DialogCloseResponse } from '../../constants/dialog.constants';
import { DISCARD_TABLE_COLUMNS } from '../../constants/discard.constant';
import { TableComponent } from '../table/table.component';
import { InfoDialogComponent } from '../infodialog/infodialog.component';

@Component({
  selector: 'app-discard-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, MatPaginator, TableComponent],
  templateUrl: './discard-dialog.component.html',
  styleUrls: ['./discard-dialog.component.scss'],
})
export class DiscardDialogComponent implements OnInit {
  columns = DISCARD_TABLE_COLUMNS;
  dataSource = new MatTableDataSource<any>([]);
  public DialogCloseResponse = DialogCloseResponse;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<DiscardDialogComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { row: Vendor },
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.row.id) {
      this.fetchData(this.data.row.id);
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
  

  fetchData(vendorId: number): void {
    this.http.get<any[]>(`http://localhost:8080/vendors/${vendorId}/parts`)
      .subscribe({
        next: (response) => {
        this.dataSource = new MatTableDataSource(response);
        this.paginator.pageSize = 10;
        this.dataSource.paginator = this.paginator;
        },
        error: (error) => {
          this.dialog.open(InfoDialogComponent, {
            width: '400px',
            data: {
              title: 'Error',
              message: 'Error fetching vendor parts.'
            }
          });
        }
      });
  }

  closeDialog(result: DialogCloseResponse): void {
    this.dialogRef.close(result);
  }
}

