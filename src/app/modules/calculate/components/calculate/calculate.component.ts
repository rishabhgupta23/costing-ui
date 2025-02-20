import { Component } from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { COST_CALCULATOR_COLUMNS } from '../../../../data/constants/cost-calculator.constants';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.scss'
})
export class CalculateComponent {
  COST_CALCULATOR_COLUMNS = COST_CALCULATOR_COLUMNS;
  isCalculated: boolean | undefined;
  totalQP: number | undefined;
onReset() {
throw new Error('Method not implemented.');
}
onCreate() {
  this.costingList = this.costingList.map(item => ({
    ...item,
    qp: item.value * item.cost // Quantity * Price Calculation
  }));
  this.totalQP = this.costingList.reduce((sum, item) => sum + item.qp, 0);
  this.isCalculated = true;
}
  // partTypes: string[] = [];
  // pricing: string[] = [];
  // calculateform = new FormGroup({
  //   partType: new FormControl(''),
  //   pricing: new FormControl(''), 
  // });
    constructor() {
    }
    partTypes = [
      { partName: 'Gear', partNumber: 'P001' },
      { partName: 'Bolt', partNumber: 'P002' },
      { partName: 'Nut', partNumber: 'P003' }
    ];
    
    pricingOptions = ['MIN', 'MAX', 'AVG'];
    
    calculateform = new FormGroup({
      partType: new FormControl(null, Validators.required),
      pricing: new FormControl(null, Validators.required)
    });
    
    costingList = [
      { partNumber: 'P-101', partName: 'Gear', value: 10, cost: 50, qp: 500, vendorName: 'XYZ Company' },
      { partNumber: 'P-102', partName: 'Bolt', value: 5, cost: 30, qp: 150, vendorName: 'ABC Suppliers' }
    ];

}
