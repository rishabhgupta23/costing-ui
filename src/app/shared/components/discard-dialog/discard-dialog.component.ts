import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { Vendor } from '../../../data/models/vendor';

@Component({
  selector: 'app-discard-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, MatPaginator],
  templateUrl: './discard-dialog.component.html',
  styleUrls: ['./discard-dialog.component.scss'],
})
export class DiscardDialogComponent implements OnInit {
  displayedColumns: string[] = ['partNumber', 'partName'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<DiscardDialogComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { row: Vendor }
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.row.id) {
      this.fetchData(this.data.row.id);
    } else {
      console.error('No vendorId provided to the dialog.');
    }
  }
  

  fetchData(vendorId: number): void {
    this.http.get<any[]>(`http://localhost:8080/vendors/${vendorId}/parts`)
      .subscribe({
        next: (response) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        },
        error: (error) => {
          console.error('Error fetching vendor parts:', error);
      
        }
      });
  }

  closeDialog(result: boolean): void {
    this.dialogRef.close(result);
  }
}

