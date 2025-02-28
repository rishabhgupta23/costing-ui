import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PartBomData, PartRow } from '../../../../data/models/part';
import { PartService } from '../../../../data/services/part/part.service';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
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
   currentPage=0;
   pageSize=100;
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
});

}

isAllSelected(): boolean {
  return this.partList.length > 0 && this.existingParts.size === this.partList.length;
}

isIndeterminate(): boolean {
  return this.existingParts.size > 0 && this.existingParts.size < this.partList.length;
}

selectAll(event: any): void {
  if (event.checked) {
    this.partList.forEach(part => this.existingParts.add(part.partId));
  } else {
    this.existingParts.clear();
  }
}

checkIfSelected(part: PartRow) {
  return this.existingParts.has(part.partId);
}

confirmSelection(): void {
  const result  = this.partList.filter(part => this.existingParts.has(part.partId));
  this.dialogRef.close({data: result, action: DialogCloseResponse.UPDATE});
}

}