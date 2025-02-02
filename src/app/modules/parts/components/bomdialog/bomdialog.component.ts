import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions } from '@angular/material/dialog';
import { PartRow } from '../../../../data/models/part';

@Component({
  selector: 'app-bomdialog',
  templateUrl: './bomdialog.component.html',
  styleUrl: './bomdialog.component.scss'
})
export class BomdialogComponent {
  displayedColumns: string[] = ['select', 'partName', 'partNumber'];
  selectedParts = new Set<any>();
   mPartList: PartRow[] =[];
   filteredPartList: PartRow[] = [];

constructor(
  public dialogRef: MatDialogRef<BomdialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data:  { filteredPartList: any[] }
) {}


togglePartSelection(part: any, event: any): void {
  if (event.checked) {
    this.selectedParts.add(part);
  } else {
    this.selectedParts.delete(part);
  }
}
ngOnInit():void{
  this.filteredPartList= this.data.filteredPartList;
}
isAllSelected(): boolean {
  return this.selectedParts.size === this.data.filteredPartList.length;
}

isIndeterminate(): boolean {
  return this.selectedParts.size > 0 && this.selectedParts.size < this.data.filteredPartList.length;
}

selectAll(event: any): void {
  if (event.checked) {
    this.selectedParts = new Set(this.filteredPartList);
  } else {
    this.selectedParts.clear();
  }
}

confirmSelection(): void {
  const selectedPartsArray=Array.from(this.selectedParts);
  console.log(selectedPartsArray);
  this.dialogRef.close(selectedPartsArray);
}

applyFilter(event: Event): void {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  this.filteredPartList = this.data.filteredPartList.filter(part =>
    (part.partName?.toLowerCase() || '').includes(filterValue) ||
    (part.partNumber?.toLowerCase() || '').includes(filterValue)
  );
}

}