import { Component, OnDestroy } from '@angular/core';
import { PartService } from '../../../../data/services/part/part.service';
import { BehaviorSubject, of, Subject, Subscription } from 'rxjs';
import { COST_FACTOR_TABLE_COLUMNS } from '../../../../data/constants/part.constants';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { Vendor } from '../../../../data/models/vendor';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface CostFactor {
  id: number;
  name: string;
  value: number;
}

@Component({
  selector: 'app-parts-form',
  templateUrl: './parts-form.component.html',
  styleUrl: './parts-form.component.scss'
})
export class PartsFormComponent implements OnDestroy {
  partTypes: string[] = [];
  partUnits: string[] = [];
  partCategories: string[] = [];
  vendorList: Vendor[] = [];
  subscriptions: Subscription[] = [];
  COST_FACTOR_TABLE_COLUMNS = COST_FACTOR_TABLE_COLUMNS;
  vendorCostMap: Map<number, CostFactor[]> = new Map();

  partForm = new FormGroup({
    partNumber: new FormControl(''),
    partName: new FormControl(''),
    categoryId: new FormControl(),
    partType: new FormControl(),
    partUnit: new FormControl(),
  });

  costDetailsForm = new FormGroup({
    vendors: new FormArray([]),
    costFactors: new FormArray([])
  });

  selectedVendor: Vendor = undefined as any;

  constructor(private partService: PartService, private vendorService: VendorService) {
    this.getPartTypes();
    this.getPartUnits();
    this.getPartCategories();
    this.getVendorList();
  }

  getPartTypes() {
    this.subscriptions.push(
      this.partService.getPartTypes().subscribe((res) => {
        this.partTypes = res;
      })
    );
  }

  getPartUnits() {
    this.subscriptions.push(
      this.partService.getPartUnits().subscribe((res) => {
        this.partUnits = res;
      })
    );
  }

  getPartCategories() {
    this.subscriptions.push(
      this.partService.getPartCategories().subscribe((res) => {
        this.partCategories = res;
      })
    );
  }

  getVendorList() {
    this.subscriptions.push(
      this.vendorService.getVendorList().subscribe((res) => {
        this.vendorList = res;
      })
    );
  }

  get costFactors() {
    return this.costDetailsForm.get('costFactors') as FormArray;
  }

  get vendors() {
    return this.costDetailsForm.get('vendors') as FormArray;
  }

  addVendor() {
    if(this.selectedVendor == undefined || this.vendorCostMap.has(this.selectedVendor.id)) {
      // show message
    } else {
      this.vendorCostMap.set(this.selectedVendor.id, []);
      this.costFactors.push(new FormControl(''));
      this.vendors.push(new FormControl(this.selectedVendor));
      console.log(this.vendorCostMap);
    }
  }

  addCostFactor(index: any, vendorId: number) {
    this.vendorCostMap.get(vendorId)?.push({
      id: index,
      name: 'ABC',
      value: 0
    } as CostFactor);
    this.vendorCostMap.set(vendorId, this.vendorCostMap.get(vendorId) || []);
    console.log(this.vendorCostMap.get(vendorId));
    
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
