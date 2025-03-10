import { Component, OnDestroy} from '@angular/core';
import { PartService } from '../../../../data/services/part/part.service';
import { map, Observable, Subscription } from 'rxjs';
import { VENDOR_COST_TABLE_COLUMNS } from '../../../../data/constants/vendor-cost-table.constants';
import { COST_FACTOR_TABLE_COLUMNS } from '../../../../data/constants/part.constants';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { Vendor } from '../../../../data/models/vendor';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PartBomData, CostFactor, CostFactorData, PartCreateRequest, PartRow, VendorCost, CostHistory, CostHistoryResponse } from '../../../../data/models/part';
import { ActivatedRoute, Router } from '@angular/router';
import { BomdialogComponent } from '../bomdialog/bomdialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BOM_TABLE_COLUMNS } from '../../../../data/constants/bom-table.constants';
import { PartType } from '../../../../shared/constants/part.constants';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { ColumnType, TableActions } from '../../../../shared/constants/table.constants';
import { HistorydialogComponent } from '../../historydialog/historydialog.component';

@Component({
  selector: 'app-part-view',
  templateUrl: './part-view.component.html',
  styleUrl: './part-view.component.scss'
})
export class PartViewComponent {
  partNames: string[] =[];
   partTypes: string[] = [];
   partUnits: string[] = [];
   partCategories: string[] = [];
   vendorList: Vendor[] = [];
   costHistoryList: any[]=[];
   costFactorList: CostFactor[] = [];
   subscriptions: Subscription[] = [];
   VENDOR_COST_TABLE_COLUMNS = VENDOR_COST_TABLE_COLUMNS;
   COST_FACTOR_TABLE_COLUMNS = COST_FACTOR_TABLE_COLUMNS;
   BOM_TABLE_COLUMNS = BOM_TABLE_COLUMNS;
   vendorCostMap: Map<number, CostFactorData[]> = new Map();
   bomPartList: PartBomData[] =[]; 
   pageSize: number = 100 // Default items per page
   partTypeEnum= PartType;
   
   
 
   partForm = new FormGroup({
    partNumber: new FormControl({ value: '', disabled: true }),
    partName: new FormControl({ value: '', disabled: true }),
    categoryId: new FormControl({value:'',disabled: true }),
    partType: new FormControl({ value: '', disabled: true }),
    partUnit: new FormControl({ value: '', disabled: true }),
  });

  filteredCostFactorTableColumns = COST_FACTOR_TABLE_COLUMNS.map(col => {
    if (col.columnType === ColumnType.INPUT_NUMBER) {
      return { ...col, columnType: ColumnType.GENERAL };
    }
    if (col.columnType === ColumnType.ACTION) {
        return null;
    }
    return col;
}).filter(col => col !== null);

filteredBomTableColumns = BOM_TABLE_COLUMNS.map(col=>{
  if(col.columnType===ColumnType.INPUT_NUMBER){
    return { ...col, columnType:ColumnType.GENERAL};
  }
  return col;
})

 
   
   costDetailsForm = new FormGroup({
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
       this.partId = this.route.snapshot.paramMap.get('id')??'';
     this.getPartTypes();
     this.getPartUnits();
     this.getPartCategories();
     this.getVendorList();
     this.getCostFactors();
 
       if (this.partId){      
         this.getPartData(this.partId);
       }
       
       }
 
       getPartData(id: string): void {
         this.partService.getPartById(id).subscribe((part) => {
           console.log('Part Data:', part); // Debug: Check the part structure
           this.partForm.patchValue({
             partNumber: part.partNumber ?? '',
             partName: part.partName ?? '',
             // categoryId: part.categoryName ?? '',
             partType: part.type ?? '',
             partUnit: part.unit ?? ''
           });
           this.vendorCostListToMap(part.vendorCostList);
           
           this.bomPartList = part.bom?.map(bomPart => ({
             id: bomPart.childPartId, // Ensure correct mapping
             partName: bomPart.childPartName, // Assuming API returns partName
             partNumber: bomPart.childPartNumber, // Assuming API returns partNumber
             value: bomPart.quantity || 0
           })) || [];
         });
       }
 
   vendorCostListToMap(vendorCostList: VendorCost[]) {
     vendorCostList.forEach((vc,i) => {
       this.addVendor(vc);
       vc.costFactorValues.forEach(cf=> {
         this.addCostFactor(cf, vc.id);
       })
     });
   }

   getVendorCostTableData() {
    let tableData: { vendorName: string; costFactor: string | undefined; value: number; }[] = [];
    this.vendorCostMap.forEach((costFactors, vendor) => {
      costFactors.forEach(costFactor => {
        tableData.push({
          vendorName: this.getVendorName(vendor),
          costFactor: costFactor.name,
          value: costFactor.value
        });
      });
    });
    return tableData;
  }

  openHistoryDialog(partId:string | null, vendorId:number):void {
    partId = partId || '';
    this.getCostHistory(partId, vendorId).subscribe((res) => {

        this.costHistoryList = res.costHistoryList;
        const dialogRef = this.dialog.open(HistorydialogComponent, {
          width: '600px',
          data: { costHistoryList: this.costHistoryList },
        });
  
        dialogRef.afterClosed().subscribe((res) => {
        });
    });
  }

getCostHistory(partId: string, vendorId: number): Observable<CostHistoryResponse> {
  return this.partService.getPartCostByPartAndVendor(partId, vendorId);
}


           
   getPartTypes() {
     this.subscriptions.push(
       this.partService.getPartTypes().subscribe((res) => {
         this.partTypes = res;
       })
     );
   }
   
 
 
   getVendorName(vendorId: number): string {
     const vendor = this.vendorList.find(v => v.id === vendorId);
     return vendor?.name || 'Unknown Vendor';
   }
   
   getPartUnits() {
    this.subscriptions.push(
      this.partService.getPartUnits().subscribe((unitNames) => {
        this.partUnits = unitNames;
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
         this.vendorList = res.data;
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
 
   get costFactors() {
     return this.costDetailsForm.get('costFactors') as FormArray;
   }
 
   addVendor(vendor: Vendor) {
     if(vendor == undefined || this.vendorCostMap.has(vendor.id)) {
       // show message
     } else {
       this.vendorCostMap.set(vendor.id, []);
       this.costFactors.push(new FormControl(''));
     }
   }
   
   bomDetailsForm = new FormGroup({
     masterParts: new FormArray([]),
   });
 
   
   get masterParts() {
     return this.bomDetailsForm.get('masterParts') as FormArray;
   }
   
 
   addCostFactor(costFactor:CostFactorData, vendorId: number) {
     if (costFactor) {
       const currentList = this.vendorCostMap.get(vendorId) || [];
       const isPresent = currentList?.some((cf: CostFactorData) => cf?.name === costFactor?.name);
 
       if (!isPresent) { 
         currentList.push({
           id: costFactor.id,
           name: costFactor.name,
           value: costFactor.value || 0
         } as CostFactorData);
   
         this.vendorCostMap.set(vendorId, currentList);
       }
     }
   }
   
 
   onSubmit(): void {
    if (this.partId) {
      this.router.navigateByUrl(`/app/parts/edit/${this.partId}`);
   }
  }
   generateBomDetailsBody() {
     return this.bomPartList.map(part => ({
       childPartId: part.id,
       quantity: Number(part.value) || 1,  // Ensure quantity is not undefined
     }));
   }
 
     generateVendorCostMapBody() {
     const vendorCostList: VendorCost[] = [];
   
     this.vendorCostMap.forEach((costFactors: CostFactorData[], vendorId: number) => {
       if (costFactors.length > 0) {
       const costFactorValues = costFactors.map(cf => ({
         id: cf.id,
         value: cf.value
       }));
   
       const vendorCostFactorData = {
         id: vendorId,
         costFactorValues
       };
   
       vendorCostList.push(vendorCostFactorData);
     }
     });
   
     return vendorCostList;
   }
 
   ngOnDestroy(): void {
     this.subscriptions.forEach(s => s.unsubscribe());
   }
 }