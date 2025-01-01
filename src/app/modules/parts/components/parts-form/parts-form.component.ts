import { Component, OnDestroy } from '@angular/core';
import { PartService } from '../../../../data/services/part/part.service';
import { BehaviorSubject, of, Subject, Subscription } from 'rxjs';
import { COST_FACTOR_TABLE_COLUMNS } from '../../../../data/constants/part.constants';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { Vendor } from '../../../../data/models/vendor';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BomDetailsData, CostFactor, CostFactorData, PartCreateRequest, PartShow, VendorCostFactorData } from '../../../../data/models/part';

@Component({
  selector: 'app-parts-form',
  templateUrl: './parts-form.component.html',
  styleUrl: './parts-form.component.scss'
})
export class PartsFormComponent implements OnDestroy {
  partNames: string[] =[];
  partTypes: string[] = [];
  partUnits: string[] = [];
  partCategories: string[] = [];
  vendorList: Vendor[] = [];
  costFactorList: CostFactor[] = [];
  subscriptions: Subscription[] = [];
  COST_FACTOR_TABLE_COLUMNS = COST_FACTOR_TABLE_COLUMNS;
  vendorCostMap: Map<number, CostFactorData[]> = new Map();
  unitPartList: BomDetailsData[] =[]; 
  mPartList: PartShow[] =[];
  

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

  selectedPart: PartShow | null = null;

  PartCreateRequest: any;


  constructor(private partService: PartService, private vendorService: VendorService) {
    this.getPartTypes();
    this.getPartUnits();
    this.getPartCategories();
    this.getVendorList();
    this.getCostFactors();
    this.getPartList();

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

  getCostFactors() {
    this.subscriptions.push(
      this.partService.getCostFactors().subscribe((res) => {
        this.costFactorList = res;
      })
    );
  }

    getPartList() {
    this.subscriptions.push(
      this.partService.getPartList().subscribe((res) => {
        this.mPartList = res.data;
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


  
  bomDetailsForm = new FormGroup({
    masterParts: new FormArray([]),
  });
  
  get filteredPartList() {
      return this.mPartList.filter(part => part.type === 'UNIT');
    }

  
  get masterParts() {
    return this.bomDetailsForm.get('masterParts') as FormArray;
  }

  // Add a new Unit Part

  addUnitPart() {
    console.log(this.selectedPart);
    
    if (!this.selectedPart) {
      console.error('No part selected');
      return;
    }
    
    const selectedValue = this.selectedPart;
    console.log(selectedValue.partId);
    
    if (selectedValue.partId && selectedValue.partName) {
      const isPresent = this.unitPartList.some(
        (item: BomDetailsData) => item?.name === selectedValue.partName
      );
      if (!isPresent) {
        this.unitPartList.push({
          id: selectedValue.partId,
          name: selectedValue.partName,
          value: 0,
        } as BomDetailsData);
        console.log(this.unitPartList)
      }
    }
  }
  

  addCostFactor(index: number, vendorId: number) {
    const selectedValue = this.costFactors.at(index)?.value;
    if(selectedValue) {
      const currentList = this.vendorCostMap.get(vendorId) || [];
      const isPresent = currentList?.some((cf: CostFactorData) => cf?.name === selectedValue?.name);
      if(!isPresent) {
        currentList.push({
          id: this.costFactors.at(index)?.value['id'],
          name: this.costFactors.at(index)?.value['name'],
          value: 0
        } as CostFactorData);
        this.vendorCostMap.set(vendorId, currentList);
      }
    }
  }

  createPart() {
    const body : PartCreateRequest = {
      partName: this.partForm.get('partName')?.value || '',
      partNumber: this.partForm.get('partNumber')?.value || '',
      partType: this.partForm.get('partType')?.value || '',
      partUnit: this.partForm.get('partUnit')?.value || '',
      vendorCostMap: this.generateVendorCostMapBody()
    } as PartCreateRequest;
    console.log('body-', body);
    this.partService.createPart(body).subscribe();
  }

  generateVendorCostMapBody() {
    const map: any = {};
    this.vendorCostMap.forEach((value: CostFactorData[], key: number) => {
      const costFactorValues: any = {};
      value.forEach((cf: CostFactorData) => {
        costFactorValues[cf.id] = cf.value;
      });
      const vendorCostFactorData = {
        vendorId: key,
        costFactorValues
      } as VendorCostFactorData;
      map[key] = vendorCostFactorData;
    });
    return map;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
