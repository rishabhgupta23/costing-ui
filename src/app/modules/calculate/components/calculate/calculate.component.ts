import { Component } from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { COST_CALCULATOR_COLUMNS } from '../../../../data/constants/cost-calculator.constants';
import { map, Observable, startWith } from 'rxjs';
import { PartService } from '../../../../data/services/part/part.service';
import { Part, PartRow } from '../../../../data/models/part';
import { CostCalculatorService } from '../../../../data/services/cost-calculator/cost-calculator.service';
import { CostingTable } from '../../../../data/models/cost-calculator';
import { PricingOptions } from '../../../../shared/constants/pricingoptions.constants';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.scss'
})
export class CalculateComponent {
  COST_CALCULATOR_COLUMNS = COST_CALCULATOR_COLUMNS;
  isCalculated: boolean | undefined;
  totalQP: number | undefined;
  partList: PartRow[] = [];
  currentPage=0;
  pageSize=100;
  costingList: CostingTable[]=[];

  partControl = new FormControl('');
  filteredParts: Observable<any[]> | undefined;

  constructor(private partService: PartService, private costCalculatorService: CostCalculatorService) {
  }

  getPartList(): void {
    this.partService.getPartList(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.partList = response.data?.partsList.map((part: PartRow) => ({
          partId: part.partId,
          partName: part.partName,
          partNumber: part.partNumber
        })) || [];
      }
    );
  }
  
  pricingOptions = Object.values(PricingOptions);
    
  calculateform = new FormGroup({
    part: new FormControl(null, Validators.required),
    pricing: new FormControl(null, Validators.required)
  });
  
  getCost(): void {
    const part = this.calculateform.value.part as PartRow | null;
    const mode = this.calculateform.value.pricing;
  
    if (part && mode) {
      this.costCalculatorService.getCost(part.partId, mode).subscribe(
        (response) => {
          this.costingList = response.costCalcDtoList || [];
          this.totalQP = response.totalCost || 0;
          this.isCalculated = true;
        }
      );
    } else {
      console.warn('Part or Pricing Mode is not selected.');
    }
  }

  onPartSelected(selectedPart: any) {
    this.calculateform.get('part')?.setValue(selectedPart);
  }
  

  ngOnInit() {
    this.getPartList();
    this.filteredParts = this.partControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: any) {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.partList.filter(option => 
      option.partName.toLowerCase().includes(filterValue) || 
      option.partNumber.toLowerCase().includes(filterValue)
    );
  }
  

  onReset() {
    this.calculateform.reset();
    this.isCalculated = false;
    this.totalQP = undefined;
  }
  

displayFn(part: any): string {
  return part ? part.partName : '';
}
}
