import { Component } from '@angular/core';
import { FormControl, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.scss'
})
export class CalculateComponent {
  partTypes: string[] = [];
  pricing: string[] = [];
  calculateform = new FormGroup({
    partType: new FormControl(''),
    pricing: new FormControl(''), 
  });
    constructor() {
    }
onCreate() {
throw new Error('Method not implemented.');
}
onReset() {
throw new Error('Method not implemented.');
}
partForm: any;
createPart() {
throw new Error('Method not implemented.');
}

}
