import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PartBomData, PartRow } from '../../../../data/models/part';
import { PartService } from '../../../../data/services/part/part.service';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { PageEvent } from '@angular/material/paginator';

import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-bomdialog',
  templateUrl: './bomdialog.component.html',
  styleUrls: ['./bomdialog.component.scss']
})
export class BomdialogComponent implements OnInit {
filterParts() {
throw new Error('Method not implemented.');
}
  displayedColumns: string[] = ['select', 'partName', 'partNumber'];
  existingParts: Set<number>= new Set();
  partList: PartRow[] = [];
paginatedData: any[] = []; // Data to display on the current page
pageSize: number = 100 // Default items per page
currentPage: number = 0;
totalRecords: number=0;
pageInfo: any;
allParts: PartRow[] = [];
searchTerm: any;
filteredPartList: PartRow[] = []; // ✅ Stores filtered parts
  searchTermName: string = ''; // ✅ For filtering by name
  searchTermNumber: string = ''; 

constructor(
  public dialogRef: MatDialogRef<BomdialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data:  { existingParts: Set<number> },
  private partService: PartService 
) {
}



closeDialog() {
  this.dialogRef.close({action: DialogCloseResponse.NO_ACTION});
  }

togglePartSelection(part: PartRow, event: any): void {
  if (event.checked) {
    this.existingParts.add(part.partId);
  } else {
    this.existingParts.delete(part.partId);
  }
}

ngOnInit():void{
  this.existingParts = new Set(this.data.existingParts);
this.getPartList();
}

getPartList():void{
  this.partService.getPartList(this.currentPage, this.pageSize).subscribe(
    (response) => {
      this.partList = response.data?.partsList || [];
      this.existingParts = this.data.existingParts;
      this.paginatedData = this.partList;
      this.totalRecords = response.pageInfo?.totalRecords || 0;
      this.allParts = [...this.allParts, ...this.partList];
      this.allParts = Array.from(new Set(this.allParts.map(part => part.partId)))
        .map(id => this.allParts.find(part => part.partId === id)!);
});

}

isAllSelected(): boolean {
  return this.partList.length > 0 && this.partList.every(part => this.existingParts.has(part.partId));
}

isIndeterminate(): boolean {
  return this.partList.some(part => this.existingParts.has(part.partId)) &&
         !this.isAllSelected();
}

selectAll(event: any): void {
  if (event.checked) {
    this.partList.forEach(part => this.existingParts.add(part.partId));
  } else {
    this.partList.forEach(part => this.existingParts.delete(part.partId));
  }
}

checkIfSelected(part: PartRow) {
  return this.existingParts.has(part.partId);
}

confirmSelection(): void {
  const result  = this.allParts.filter(part => this.existingParts.has(part.partId));
  this.dialogRef.close({data: result, action: DialogCloseResponse.UPDATE});
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