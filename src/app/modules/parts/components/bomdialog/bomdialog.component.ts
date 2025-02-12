import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PartBomData, PartRow } from '../../../../data/models/part';
import { PartService } from '../../../../data/services/part/part.service';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';

@Component({
  selector: 'app-bomdialog',
  templateUrl: './bomdialog.component.html',
  styleUrl: './bomdialog.component.scss'
})
export class BomdialogComponent {
  displayedColumns: string[] = ['select', 'partName', 'partNumber'];
  existingParts: Set<number>= new Set();
  partList: PartRow[] = [];
   currentPage=0;
   pageSize=100;

constructor(
  public dialogRef: MatDialogRef<BomdialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data:  { existingParts: Set<number> },
  private partService: PartService 
) {
  console.log(data);
}


closeDialog() {
  this.dialogRef.close({action: DialogCloseResponse.NO_ACTION});
  }

togglePartSelection(part: PartRow, event: any): void {
  console.log(event, part);
  if (event.checked) {
    this.existingParts.add(part.partId);
  } else {
    this.existingParts.delete(part.partId);
  }
}

ngOnInit():void{
this.getPartList();
}

getPartList():void{
  this.partService.getPartList(this.currentPage, this.pageSize).subscribe(
    (response) => {
      this.partList = response.data || [];
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