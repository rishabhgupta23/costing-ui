import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-changepass-dailog',
  templateUrl: './changepass-dailog.component.html',
  styleUrl: './changepass-dailog.component.scss'
})
export class ChangepassDailogComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  hideNew=true;
  hideConfirm=true;

    private strongPasswordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(
    private dialogRef: MatDialogRef<ChangepassDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { emailId: string }
  ) {}

  isPasswordValid(): boolean {
    return this.strongPasswordPattern.test(this.newPassword);
  }

  isValid(): boolean {
    return (
      this.isPasswordValid() &&
      this.newPassword === this.confirmPassword
    );
  }


  onConfirm() {
    if (this.isValid()) {
      this.dialogRef.close({
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      });
    }
  }
}
