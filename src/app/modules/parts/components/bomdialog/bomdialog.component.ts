import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions } from '@angular/material/dialog';
import { PartRow } from '../../../../data/models/part';
import { HttpClient } from '@angular/common/http';
import { PartService } from '../../../../data/services/part/part.service';

@Component({
  selector: 'app-bomdialog',
  templateUrl: './bomdialog.component.html',
  styleUrl: './bomdialog.component.scss'
})
export class BomdialogComponent {
  displayedColumns: string[] = ['select', 'partName', 'partNumber'];
  selectedParts:Set<number>= new Set();
   filteredPartList: PartRow[] = [];
   allParts: PartRow[] =[];
   currentPage=0;
   pageSize=100;

constructor(
  public dialogRef: MatDialogRef<BomdialogComponent>,
  private http: HttpClient,
  @Inject(MAT_DIALOG_DATA) public data:  { selectedParts: number[] },
  private partService: PartService 
) {}


closeDialog(result: boolean) {
  this.dialogRef.close(result);
  }

togglePartSelection(part: PartRow, event: any): void {
  if (event.checked) {
    this.selectedParts.add(part.partId);
  } else {
    this.selectedParts.delete(part.partId);
  }
}
ngOnInit():void{
  this.partService.getPartList(this.currentPage, this.pageSize).subscribe(
    (response) => {
      this.filteredPartList = response.data || [];
      this.allParts = response.data || [];
      this.selectedParts = new Set(this.data.selectedParts || []);
});

  
}

isAllSelected(): boolean {
  return this.filteredPartList.length > 0 && this.selectedParts.size === this.filteredPartList.length;
}

isIndeterminate(): boolean {
  return this.selectedParts.size > 0 && this.selectedParts.size < this.filteredPartList.length;
}

selectAll(event: any): void {
  if (event.checked) {
    this.filteredPartList.forEach(part => this.selectedParts.add(part.partId));
  } else {
    this.selectedParts.clear();
  }
}

confirmSelection(): void {
  this.dialogRef.close(new Set(this.selectedParts));
}


applyFilter(event: Event): void {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  this.filteredPartList = this.allParts.filter(part =>
    (part.partName?.toLowerCase() || '').includes(filterValue) ||
    (part.partNumber?.toLowerCase() || '').includes(filterValue)
  );
}

}