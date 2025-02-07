import { Component, OnDestroy} from '@angular/core';
import { PartService } from '../../../../data/services/part/part.service';
import { Subscription } from 'rxjs';
import { COST_FACTOR_TABLE_COLUMNS } from '../../../../data/constants/part.constants';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { Vendor } from '../../../../data/models/vendor';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PartBomData, CostFactor, CostFactorData, PartCreateRequest, PartRow, VendorCostFactorData } from '../../../../data/models/part';
import { ActivatedRoute, Router } from '@angular/router';
import { BomdialogComponent } from '../bomdialog/bomdialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BOM_TABLE_COLUMNS } from '../../../../data/constants/bom-table.constants';
import { PartType } from '../../../../shared/constants/part.constants';

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
  BOM_TABLE_COLUMNS = BOM_TABLE_COLUMNS;
  vendorCostMap: Map<number, CostFactorData[]> = new Map();
  bomPartList: PartBomData[] =[]; 
  partList: PartRow[] =[];
  pageSize: number = 100 // Default items per page
  selectedParts: Set<number> = new Set<number>();
  partTypeEnum= PartType;
  
  

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

  // selectedPart: PartRow | null = null;

  PartCreateRequest: any;
  partId: string | null = null;


  constructor(private partService: PartService, private vendorService: VendorService,     private route: ActivatedRoute,
    private router: Router, private dialog: MatDialog) {
      
    }

    ngOnInit(): void{
      this.partId = this.route.snapshot.paramMap.get('id');
    this.getPartTypes();
    this.getPartUnits();
    this.getPartCategories();
    this.getVendorList();
    this.getCostFactors();
    this.getPartList();

      if (this.partId){
        this.getPartData(this.partId);
      }
      }

      getPartData(id: string): void {
        this.partService.getPartById(id).subscribe((part) => {
          console.log('Part Data:', part); // Debug: Check the part structure
          this.partForm.patchValue({
            partNumber: part.partNumber,
            partName: part.partName,
            categoryId: part.categoryName,
            partType: part.type,
            partUnit: part.unit,
          });
      
          // // Populate vendorCostMap and cost details
          // part.vendorCostMap?.forEach((vendorCost: { vendorId: number; costFactorValues: CostFactorData[] }) => {
          //   this.vendorCostMap.set(vendorCost.vendorId, vendorCost.costFactorValues);
          //   this.costFactors.push(new FormControl(''));
          //   this.vendors.push(new FormControl(vendorCost.vendorId));
          // });
      
        //   this.unitPartList = part.bomDetails || [];
        });
      }
      
  getPartTypes() {
    this.subscriptions.push(
      this.partService.getPartTypes().subscribe((res) => {
        this.partTypes = res;
      })
    );
  }

  openBomDialog(): void {
    const dialogRef = this.dialog.open(BomdialogComponent, {
      width: '600px',
      data: { 
        filteredPartList: this.partList,
      selectedParts: this.bomPartList.map(part => part.id)
       }
    });
  
    dialogRef.afterClosed().subscribe((selectedPartsArray) => {
      if (selectedPartsArray) {
        this.bomPartList = this.bomPartList.filter(part =>
          selectedPartsArray.some((selected: { partId: any; }) => selected.partId === part.id)
        );
    
        selectedPartsArray.forEach((selectedPart: { partId: any; partNumber: any; partName: any; }) => {
          const exists = this.bomPartList.some(part => part.id === selectedPart.partId);
          if (!exists) {
            this.bomPartList.push({
              id: selectedPart.partId,
              partNumber: selectedPart.partNumber,
              partName: selectedPart.partName,
              value: 0 // default value, you may want to set it based on your form logic
        });
      }
    });
  }
});
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

    getPartList(page: number = 0, size: number = this.pageSize) {
    this.subscriptions.push(
      this.partService.getPartList(page,size).subscribe((res) => {
        this.partList = res.data;
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

  
  get masterParts() {
    return this.bomDetailsForm.get('masterParts') as FormArray;
  }

  // Add a new Unit Part
  addPartToBom() {
    if (this.selectedParts.size === 0) {
      console.error('No part selected');
      return;
    }

    // Add selected parts to the unitPartList
    this.partList.forEach(part => {
      if (this.selectedParts.has(part.partId)) {
        const isPresent = this.bomPartList.some(item => item?.partName === part.partName);
        if (!isPresent) {
          this.bomPartList.push({
            id: part.partId,
            partName: part.partName,
            partNumber: part.partNumber,
            value: 0,
          } as PartBomData);
        }
      }
    });
    console.log(this.bomPartList);
  }

  
  // addUnitPart() {
  //   console.log(this.selectedPart);
    
  //   if (!this.selectedPart) {
  //     console.error('No part selected');
  //     return;
  //   }
    
  //   const selectedValue = this.selectedPart;
  //   console.log(selectedValue.partId);
    
  //   if (selectedValue.partId && selectedValue.partName) {
  //     const isPresent = this.unitPartList.some(
  //       (item: BomDetailsData) => item?.name === selectedValue.partName
  //     );
  //     if (!isPresent) {
  //       this.unitPartList.push({
  //         id: selectedValue.partId,
  //         name: selectedValue.partName,
  //         value: 0,
  //       } as BomDetailsData);
  //       console.log(this.unitPartList)
  //     }
  //   }
  // }
  

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

  onSubmit(): void {
    const categoryIdValue = this.partForm.get('categoryId')?.value || null;
    const body: PartCreateRequest = {
      partName: this.partForm.get('partName')?.value || '',
      partNumber: this.partForm.get('partNumber')?.value || '',
      type: this.partForm.get('partType')?.value || '',
      unit: this.partForm.get('partUnit')?.value || '',
      vendorCostMap: this.generateVendorCostMapBody(),
      categoryId: categoryIdValue ,
      bom: this.generateBomDetailsBody()
    };

    if (this.partId) {
      // Update part if ID exists
      this.partService.updatePart(this.partId, body).subscribe(() => {
        this.router.navigateByUrl('/app/parts'); // Redirect to parts list
      });
    } else {
      // Create new part
      this.partService.createPart(body).subscribe(() => {
        this.router.navigateByUrl('/app/parts'); // Redirect to parts list
      });
    }
  }
  generateBomDetailsBody() {
    return this.bomPartList.map(part => ({
      childPartId: part.id,
      quantity: parseFloat(part.value) || 1,  // Ensure quantity is not undefined
    }));
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
