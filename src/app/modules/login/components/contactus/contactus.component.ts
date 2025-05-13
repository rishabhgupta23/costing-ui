import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';


@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.scss'
})
export class ContactusComponent implements OnInit {

  constructor(private snackBar: MatSnackBar, private location: Location) {}

  ngOnInit(): void{
    console.log('start');
  }
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
