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
import { HistorydialogComponent } from '../historydialog/historydialog.component';
import { downloadFile, downloadBlobFile } from '../../../../shared/utils/file-download.util';
import { getValueOrNull } from '../../../../shared/utils/string.util';

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
  partFileUrls: string[] = [];
  selectedFiles: File[] = [];
  partFilePreviews: { url: string, type: string, previewUrl?: string }[] = [];
 
 
   constructor(private partService: PartService, private route: ActivatedRoute,
     private router: Router, private dialog: MatDialog) {
       
     }
 
     ngOnInit(): void{
      this.partId = getValueOrNull(this.route.snapshot.paramMap.get('id'));
       if (this.partId){      
         this.getPartData(this.partId);
       }
       this.getPartFiles(this.partId || '');
       }
 
       getPartData(id: string): void {
        this.partService.getPartById(id).subscribe((part) => {
          this.vendorCostList = getValueOrNull(part.vendorCostList);
      
          this.partForm.patchValue({
            partNumber: getValueOrNull(part.partNumber),
            partName: getValueOrNull(part.partName),
            // categoryId: getValueOrNull(part.categoryName),
            partType: getValueOrNull(part.type),
            partUnit: getValueOrNull(part.unit)
          });
      
          this.vendorCostListToMap(this.vendorCostList);
      
          this.bomPartList = getValueOrNull(part.bom).map(bomPart => ({
            id: getValueOrNull(bomPart.childPartId),
            partName: getValueOrNull(bomPart.childPartName),
            partNumber: getValueOrNull(bomPart.childPartNumber),
            value: getValueOrNull(bomPart.quantity)
          }));
        });
      }
 
    getPartFiles(partId: string): void {
  this.partService.getPartFiles(partId).subscribe({
    next: (urls) => {
      this.partFileUrls = urls;
      this.partFilePreviews = urls.map(url => {
        const type = this.getFileTypeFromUrl(url);
        const fileObj: any = { url, type };
        if (type === 'image') {
          this.partService.downloadPartFile(url).subscribe((response: any) => {
            // Assuming response.fileData is base64 string
            fileObj.previewUrl = 'data:image/png;base64,' + response.fileData;
          });
        }
        return fileObj;
      });
    },
    error: (err) => {
      console.error('Error fetching part files:', err);
    }
  });
}

getFileTypeFromUrl(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'image';
    case 'pdf':
      return 'pdf';
    case 'doc':
    case 'docx':
      return 'word';
    case 'xls':
    case 'xlsx':
      return 'excel';
    default:
      return 'other';
  }
}

downloadPartFile(fileUrl: string): void {
  this.partService.downloadPartFile(fileUrl).subscribe((response: any) => {
    const fileName = response.fileName || fileUrl.split('/').pop() || 'partFile';
    downloadFile(response.fileData, fileName);
  });
}


 
       vendorCostListToMap(vendorCostList: VendorCost[]) {
        vendorCostList.forEach((vc) => {
          vc.costFactorValues.forEach(cf => {
            const currentList = this.vendorCostMap.get(vc.id) || [];
            currentList.push({ id: cf.id, name: cf.name, value: getValueOrNull(cf.value)});
            this.vendorCostMap.set(vc.id, currentList);
          });
        });
      }

      getVendorCostTableData() {
        let tableData: { vendorName: string; costFactor: string | undefined; value: number }[] = [];
        this.vendorCostMap.forEach((costFactors, vendorId) => {
          const vendor = this.vendorCostList.find((vc: { id: number; }) => vc.id === vendorId);
          const vendorName = getValueOrNull(vendor?.name);
      
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
    partId = getValueOrNull(partId);
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

  downloadBomExcel() {
    const partId = getValueOrNull(this.partId);
    this.partService.downloadBomExcel(partId).subscribe(response => {
      downloadFile(response.fileData, response.fileName || 'bomPartList.xlsx');
    });
  }
  
   
   ngOnDestroy(): void {
     this.subscriptions.forEach(s => s.unsubscribe());
   }
 }