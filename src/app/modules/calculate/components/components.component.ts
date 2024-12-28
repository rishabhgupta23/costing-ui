import { Component } from '@angular/core';
import { FormControl, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrl: './components.component.scss'
})
export class ComponentsComponent {
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
