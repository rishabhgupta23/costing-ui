import { Component} from '@angular/core';
import { PartService } from '../../../../data/services/part/part.service';
import {Observable, Subscription } from 'rxjs';
import { VENDOR_COST_TABLE_COLUMNS } from '../../../../data/constants/vendor-cost-table.constants';
import { COST_FACTOR_TABLE_COLUMNS } from '../../../../data/constants/part.constants';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { Vendor } from '../../../../data/models/vendor';
import {FormControl, FormGroup} from '@angular/forms';
import { PartBomData, CostFactorData, VendorCost, CostHistoryResponse } from '../../../../data/models/part';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog} from '@angular/material/dialog';
import { BOM_TABLE_COLUMNS } from '../../../../data/constants/bom-table.constants';
import { PartType } from '../../../../shared/constants/part.constants';
import { ColumnType} from '../../../../shared/constants/table.constants';
import { HistorydialogComponent } from '../../historydialog/historydialog.component';

@Component({
  selector: 'app-part-view',
  templateUrl: './part-view.component.html',
  styleUrl: './part-view.component.scss'
})
export class PartViewComponent {
   vendorCostList: VendorCost[] = [];
   costHistoryList: any[]=[];
   subscriptions: Subscription[] = [];
   VENDOR_COST_TABLE_COLUMNS = VENDOR_COST_TABLE_COLUMNS;
   COST_FACTOR_TABLE_COLUMNS = COST_FACTOR_TABLE_COLUMNS;
   BOM_TABLE_COLUMNS = BOM_TABLE_COLUMNS;
   vendorCostMap: Map<number, CostFactorData[]> = new Map();
   bomPartList: PartBomData[] =[]; 
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
 
   partId: string | null = null;
  part: any;
 
 
   constructor(private partService: PartService, private route: ActivatedRoute,
     private router: Router, private dialog: MatDialog) {
       
     }
 
     ngOnInit(): void{
       this.partId = this.route.snapshot.paramMap.get('id')??'';
 
       if (this.partId){      
         this.getPartData(this.partId);
       }
       
       }
 
       getPartData(id: string): void {
         this.partService.getPartById(id).subscribe((part) => {
           console.log('Part Data:', part); // Debug: Check the part structure
           this.vendorCostList = part.vendorCostList || [];
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
        vendorCostList.forEach((vc) => {
          vc.costFactorValues.forEach(cf => {
            const currentList = this.vendorCostMap.get(vc.id) || [];
            currentList.push({ id: cf.id, name: cf.name, value: cf.value || 0 });
            this.vendorCostMap.set(vc.id, currentList);
          });
        });
      }

      getVendorCostTableData() {
        let tableData: { vendorName: string; costFactor: string | undefined; value: number }[] = [];
        this.vendorCostMap.forEach((costFactors, vendorId) => {
          const vendor = this.part?.PartDetails.vendorCostList.find((vc: { id: number; }) => vc.id === vendorId);
          const vendorName = vendor?.name || 'Unknown Vendor';
      
          costFactors.forEach(costFactor => {
            tableData.push({
              vendorName: vendorName,
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
 
   editPart(): void {
    if (this.partId) {
      this.router.navigateByUrl(`/app/parts/edit/${this.partId}`);
   }
  }
   
   ngOnDestroy(): void {
     this.subscriptions.forEach(s => s.unsubscribe());
   }
 }