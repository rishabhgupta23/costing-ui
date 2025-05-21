import { Component} from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  standalone: true,
  imports: [MatSnackBarModule, MatIconModule],
  styleUrl: './contactus.component.scss'
})
export class ContactusComponent {

  constructor(private snackBar: MatSnackBar, private location: Location) {}

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.snackBar.open('Copied to clipboard!', 'Close', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
          panelClass: ['custom-snackbar']
      });
      
    });
  }

  goBack(): void {
    this.location.back();
  }

}
