import { AfterViewInit,Component, Inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PartBomData, PartRow } from '../../../../data/models/part';
import { PartService } from '../../../../data/services/part/part.service';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { PageEvent } from '@angular/material/paginator';

import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { TableComponent } from '../../../../shared/components/table/table.component';
@Component({
  selector: 'app-bomdialog',
  templateUrl: './bomdialog.component.html',
  styleUrls: ['./bomdialog.component.scss']
})
export class BomdialogComponent implements OnInit,AfterViewInit {

  displayedColumns: string[] = ['select', 'partName', 'partNumber'];
  existingParts: Set<number>= new Set();
  partList: PartRow[] = [];
  @ViewChild(TableComponent) tableComponent!: TableComponent;
paginatedData: any[] = []; 
pageSize: number = 100 
currentPage: number = 0;
totalRecords: number=0;
pageInfo: any;
allParts: PartRow[] = [];  
searchTerm: any;
filteredPartList: PartRow[] = [];
searchTermName: string = ''; 
searchTermNumber: string = ''; 
sortMode: string ='ASC' ;// Default sort order
sortColumn: string = 'partNumber';
// sortMode: 'asc' | 'desc' = 'asc';
 filterCriteria: Map<string, string> = new Map();
 private searchSubject = new Subject<{ key: string; value: string }>();
constructor(
  public dialogRef: MatDialogRef<BomdialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data:  { existingParts: Set<number> },
  private partService: PartService 
) {
}
closeDialog() {
  this.dialogRef.close({action: DialogCloseResponse.NO_ACTION});
  }

  ngAfterViewInit(): void {
    if (this.tableComponent) {
      this.tableComponent.sortedColumn = 'partNumber';
      this.tableComponent.sortedOrder = 'asc';
      this.tableComponent.sortChanged.emit({ key: 'partNumber', order: 'asc' });
    }
  }
 

togglePartSelection(part: PartRow, event: any): void {
  if (event.checked) {
    this.existingParts.add(part.partId);
  } else {
    this.existingParts.delete(part.partId);
  }
}

applySort(sort: { key: string }): void {
  if (this.sortColumn === sort.key) {
    // Toggle sorting order between 'ASC' and 'DESC'
    this.sortMode = this.sortMode === 'ASC' ? 'DESC' : 'ASC';
  } else {
    // Set new column and default to 'ASC'
    this.sortColumn = sort.key;
    this.sortMode = 'ASC';
  }
  this.getPartList(); // Call function to fetch sorted data
}


// applySort(sort: { key: string; order: string }): void {
//   if (!sort.order) return;
//   this.sortColumn = sort.key;
//   this.sortMode = sort.order.toUpperCase();
//   this.getPartList();
// }

// applySort(sort: { key: string; order: string }): void {
//   console.log('sorting is done', sort)
//   if (!sort.order) return;
//   this.sortColumn = sort.key;
//   this.sortMode = sort.order.toUpperCase() as 'asc' | 'desc'; 
  
//   console.log('Applied sort column:', this.sortColumn); // ✅ Verify sorting column
//   console.log('Applied sort mode:', this.sortMode); // ✅// ✅ Fix: Explicit casting
//   this.getPartList();
// }


// applySort(sort: { key: string; order: string }): void {
//   if (!sort.order) return;
//   this.sortMode = this.sortColumn === sort.Key && this.sortMode === 'asc' ? 'desc' : 'asc';
//   this.sortColumn = sort.Key;
//   this.getPartList();
// }

// applySort(sort: { key: string; order: string }): void {
//   if (!sort.order) return;
//   this.sortColumn = sort.key;
//   this.sortMode = sort.order.toUpperCase();
//   this.getPartList();
//   }


ngOnInit():void{
  this.existingParts = new Set(this.data.existingParts);
this.getPartList();
this.listenToFilterChanges();
}


getPartList():void{
  this.partService.getPartList(this.currentPage, this.pageSize, this.filterCriteria, this.sortColumn, this.sortMode).subscribe(
    (res) => {
      
      this.partList = res.data?.partsList || [];
      const mappedParts = this.partList.map(part => part.partName);
      this.existingParts = this.data.existingParts;
      this.paginatedData = this.partList;
      this.totalRecords = res.pageInfo?.totalRecords || 0;
      this.allParts = [...this.allParts, ...this.partList];
      this.allParts = Array.from(new Set(this.allParts.map(part => part.partId)))
        .map(id => this.allParts.find(part => part.partId === id)!);
});

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

applyFilter(): void {
  
  if (this.searchTermName) {
    this.filterCriteria.set('partName', this.searchTermName);
    this.searchSubject.next({ key: 'partName', value: this.searchTermName });
  }
  if (this.searchTermNumber) {
    this.filterCriteria.set('partNumber', this.searchTermNumber);
    this.searchSubject.next({ key: 'partNumber', value: this.searchTermNumber });
    }
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