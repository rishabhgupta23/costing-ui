import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule]
})
export class EditDialogComponent {
  updatedName: string;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {
    this.updatedName = data.name;
  }

  onUpdate(): void {
    this.dialogRef.close(this.updatedName);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

