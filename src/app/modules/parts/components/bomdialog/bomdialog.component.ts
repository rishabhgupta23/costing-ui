import { AfterViewInit,Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PartBomData, PartRow, SortState } from '../../../../data/models/part';
import { PartService } from '../../../../data/services/part/part.service';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { PageEvent } from '@angular/material/paginator';

import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SortIcons } from '../../../../shared/constants/table.constants';
import { getValueOrNull } from '../../../../shared/utils/string.util';
@Component({
  selector: 'app-bomdialog',
  templateUrl: './bomdialog.component.html',
  styleUrls: ['./bomdialog.component.scss']
})

export class BomdialogComponent implements OnInit {
displayedColumns: string[] = ['select', 'partName', 'partNumber'];
  existingParts: Set<number>= new Set();
  partList: PartRow[] = [];
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
sortMode: string = SortIcons.ASC ;
sortColumn: string = 'partNumber';
sortState: SortState={sortColumn:'partNumber',sortState:SortIcons.ASC}

 filterCriteria: Map<string, string> = new Map();
 private searchSubject = new Subject<{ key: string; value: string }>();
col: any;
constructor(
  public dialogRef: MatDialogRef<BomdialogComponent>,
@Inject(MAT_DIALOG_DATA) public data: { existingParts: Set<number>, excludePartId?: string },
  private partService: PartService 
) {
}
closeDialog() {
  this.dialogRef.close({action: DialogCloseResponse.NO_ACTION});
  }

   toggleSort(key: string): void {
      this.sortState = {
        sortColumn: key,
        sortState: this.sortState.sortColumn !== key ? SortIcons.ASC : 
                   this.sortState.sortState === SortIcons.ASC ? SortIcons.DESC : SortIcons.ASC
      };
      this.applySort(this.sortState);
    }
    
    getSortIcon(key: string): string {
      return this.sortState.sortColumn === key 
        ? (this.sortState.sortState === SortIcons.ASC ? SortIcons.ASC : SortIcons.DESC) 
        : SortIcons.DEFAULT;
    }

togglePartSelection(part: PartRow, event: any): void {
  if (event.checked) {
    this.existingParts.add(part.partId);
  } else {
    this.existingParts.delete(part.partId);
  }
}

applySort(sort:SortState): void {
  this.sortState=sort;
  this.getPartList();
}


ngOnInit():void{
  this.existingParts = new Set(this.data.existingParts);
this.getPartList();
this.listenToFilterChanges();
}

listenToFilterChanges(): void {
  this.searchSubject
    .pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => prev.value === curr.value)
    )
    .subscribe(() => {
      this.currentPage = 0;
      this.getPartList(); 
      
      });
  }

applyFilter(): void {
  
  if (this.searchTermName) {
    this.filterCriteria.set('partName', this.searchTermName);
    this.searchSubject.next({ key: 'partName', value: this.searchTermName });
  }else {
    this.filterCriteria.delete('partName'); 
  }
  if (this.searchTermNumber) {
    this.filterCriteria.set('partNumber', this.searchTermNumber);
    this.searchSubject.next({ key: 'partNumber', value: this.searchTermNumber });
    }else {
  this.filterCriteria.delete('partNumber'); // Remove filter if input is cleared
}
   const filterObject = Object.fromEntries(this.filterCriteria);
   this.searchSubject.next({ key: 'update', value: JSON.stringify(filterObject) });
  }

isAllSelected(): boolean {
  return this.partList.length > 0 && this.partList.every(part => this.existingParts.has(part.partId));
}
  
getPartList(): void {
  this.partService.getPartList(this.currentPage, this.pageSize, this.filterCriteria, this.sortColumn, this.sortState).subscribe(
    (res) => {
      let parts: PartRow[] = getValueOrNull(res.data?.partsList);

      if (this.data?.excludePartId) {
        parts = parts.filter(part => String(part.partId) !== this.data.excludePartId);
      }

      this.partList = parts;
      this.existingParts = this.data.existingParts;
      this.paginatedData = this.partList;
      this.totalRecords = getValueOrNull(res.pageInfo?.totalRecords);
      this.allParts = [...this.allParts, ...this.partList];
      this.allParts = Array.from(new Set(this.allParts.map(part => part.partId)))
        .map(id => this.allParts.find(part => part.partId === id)!);
    }
  );
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



