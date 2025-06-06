import { Component } from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { COST_CALCULATOR_COLUMNS } from '../../../../data/constants/cost-calculator.constants';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, Subject, switchMap } from 'rxjs';
import { PartService } from '../../../../data/services/part/part.service';
import { Part, PartRow } from '../../../../data/models/part';
import { CostCalculatorService } from '../../../../data/services/cost-calculator/cost-calculator.service';
import { CostItem } from '../../../../data/models/cost-calculator';
import { PricingOptions } from '../../../../shared/constants/pricingoptions.constants';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.scss'
})
export class CalculateComponent {
  costCalculatorColumn: any[] = COST_CALCULATOR_COLUMNS(false); 
  isCalculated: boolean | undefined;
  totalQP: number | undefined;
  partList: PartRow[] = [];
  currentPage=0;
  pageSize=100;
  costingList: CostItem[]=[];
  defaultCostingList: CostItem[] = [];
  filterCriteria:  Map<string, string> = new Map();
  totalRecords:number=0;
  toggleControl = new FormControl(false);

  filteredParts: Observable<PartRow[]> | undefined;

  constructor(private partService: PartService, private costCalculatorService: CostCalculatorService, private overlayContainer:OverlayContainer) {
  }

     onAutocompleteOpened() {
    this.overlayContainer.getContainerElement().classList.add('autocomplete-open');
  }

  onAutocompleteClosed() {
    this.overlayContainer.getContainerElement().classList.remove('autocomplete-open');
  }
  getPartList(): void {
    this.partService.getPartList(this.currentPage, this.pageSize, this.filterCriteria).subscribe(
      (response) => {
        this.partList = response.data?.partsList.map((part: PartRow) => ({
          partId: part.partId,
          partName: part.partName,
          partNumber: part.partNumber,
        })) || [];
          this.totalRecords=response.pageInfo?.totalRecords;
      }
    );
  }
  pricingOptions = Object.values(PricingOptions);
    
  calculateform = new FormGroup({
    partControl: new FormControl(null, Validators.required),
    pricing: new FormControl(null, Validators.required)
  });
  
  getCost(): void {
    const part = this.calculateform.value.partControl as PartRow | null;
    const mode = this.calculateform.value.pricing;
  
    if (part && mode) {
      this.costCalculatorService.getCost(part.partId, mode).subscribe(
        (response) => {
          this.costingList = response.costCalcDtoList || [];
          this.defaultCostingList = JSON.parse(JSON.stringify(this.costingList));
          this.totalQP = response.totalCost || 0;
          this.isCalculated = true;
        }
      );
    } else {
      console.warn('Part or Pricing Mode is not selected.');
    }
  }

  onPartSelected(selectedPart: any) {
    this.calculateform.get('partControl')?.setValue(selectedPart);
  }

  onResetClick(){
      this.costingList = JSON.parse(JSON.stringify(this.defaultCostingList));
      this.totalQP = this.costingList.reduce((sum, item) => sum + (item.subTotal ?? 0), 0);
  }
  get partControl(): FormControl {
    return this.calculateform.get('partControl') as FormControl;
  }
  

  ngOnInit() {
    this.getPartList();
    this.filteredParts = this.partControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const filterValue = value ?? '';
        this.filterCriteria.set('partName', filterValue);
        return this.partService.getPartList(this.currentPage, this.pageSize, this.filterCriteria);
      }),
      map((response) => {
        this.partList = response.data?.partsList || [];
        return this.partList;
      })
    );
    this.toggleControl.valueChanges.subscribe((value) => {
      this.costCalculatorColumn = COST_CALCULATOR_COLUMNS(value ?? false);
      if (!value) {
        this.costingList = JSON.parse(JSON.stringify(this.defaultCostingList));
        this.totalQP = this.costingList.reduce((sum, item) => sum + (item.subTotal ?? 0), 0);
      }
    });
  }
  
  

  onReset() {
    this.calculateform.reset();
    this.isCalculated = false;
    this.totalQP = undefined;
  }
  onCellEdit(row: CostItem, changedKey: string): void {
    if (this.toggleControl.value) {
      const quantity = row.quantity ?? 0;
      const rate = row.rate ?? 0;
      row.subTotal = quantity * rate;
      this.totalQP = this.costingList.reduce((sum, item) => (sum + (item.subTotal == undefined ? 0: item.subTotal)), 0);
    }
  }
  
  

displayFn(part: any): string {
  return part ? part.partName : '';
}
}
