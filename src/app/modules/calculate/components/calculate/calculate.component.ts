import { Component } from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { COST_CALCULATOR_COLUMNS } from '../../../../data/constants/cost-calculator.constants';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, Subject, switchMap } from 'rxjs';
import { PartService } from '../../../../data/services/part/part.service';
import { Part, PartRow } from '../../../../data/models/part';
import { CostCalculatorService } from '../../../../data/services/cost-calculator/cost-calculator.service';
import { CostItem } from '../../../../data/models/cost-calculator';
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
  costingList: CostItem[]=[];
  filterCriteria:  Map<string, string> = new Map();
  totalRecords:number=0;
  private searchSubject = new Subject<{ key: string; value: string }>(); 

  partControl = new FormControl('');
  filteredParts: Observable<PartRow[]> | undefined;

  constructor(private partService: PartService, private costCalculatorService: CostCalculatorService) {
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
  applyFilter(filter: { key: string; value: string }): void {
    this.filterCriteria.set(filter.key, filter.value);
    this.searchSubject.next(filter);
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
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const filterValue = value ?? '';
        this.filterCriteria.set('partName', filterValue);
        this.filterCriteria.set('partNumber', filterValue)
        return this.partService.getPartList(this.currentPage, this.pageSize, this.filterCriteria);
      }),
      map((response) => {
        this.partList = response.data?.partsList || [];
        return this.partList.filter(part => 
          part.partName?.toLowerCase().includes(this.filterCriteria.get('partName')?.toLowerCase() || '') || 
          part.partNumber?.toLowerCase().includes(this.filterCriteria.get('partNumber')?.toLowerCase() || '')
        );
      })
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
