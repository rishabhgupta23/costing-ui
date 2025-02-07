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
  @Inject(MAT_DIALOG_DATA) public data:  { filteredPartList: any[], selectedParts: [] }
) {}


togglePartSelection(part: any, event: any): void {
  if (event.checked) {
    this.selectedParts.add(part.partId);
  } else {
    this.selectedParts.delete(part.partId);
  }
}
ngOnInit():void{
  this.filteredPartList= this.data.filteredPartList;
  this.selectedParts = new Set(this.data.selectedParts || []);
}
isAllSelected(): boolean {
  return this.selectedParts.size === this.data.filteredPartList.length;
}

isIndeterminate(): boolean {
  return this.selectedParts.size > 0 && this.selectedParts.size < this.data.filteredPartList.length;
}

selectAll(event: any): void {
  if (event.checked) {
    this.filteredPartList.forEach(part => this.selectedParts.add(part.partId));
  } else {
    this.selectedParts.clear();
  }
}

confirmSelection(): void {
  const selectedPartsArray = this.filteredPartList.filter(part =>
    this.selectedParts.has(part.partId)
  );
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