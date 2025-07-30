import { Component, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PartService } from '../../../../data/services/part/part.service';
import { concat, concatMap, from,of, debounceTime, distinctUntilChanged, map, Observable, startWith, Subscription, switchMap } from 'rxjs';
import { COST_FACTOR_TABLE_COLUMNS } from '../../../../data/constants/part.constants';
import { VendorService } from '../../../../data/services/vendor/vendor.service';
import { Vendor } from '../../../../data/models/vendor';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PartBomData, CostFactor, CostFactorData, PartCreateRequest, PartRow, VendorCost, PartAttributeValue } from '../../../../data/models/part';
import { ActivatedRoute, Router } from '@angular/router';
import { BomdialogComponent } from '../bomdialog/bomdialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BOM_TABLE_COLUMNS } from '../../../../data/constants/bom-table.constants';
import { PartType } from '../../../../shared/constants/part.constants';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { TableActions } from '../../../../shared/constants/table.constants';
import { SnackbarService } from '../../../../data/services/snackbar/snackbar.service';
import { MatStepper } from '@angular/material/stepper';
import { getValueOrNull } from '../../../../shared/utils/string.util';
import { fileToBase64 } from 'src/app/shared/utils/file-download.util';

import { CostFactorService } from 'src/app/data/services/cost-factor/cost-factor.service';
import { ProgressDialogComponent } from 'src/app/shared/components/progress-dialog/progress-dialog.component';
import { AttributeRow, TemplateResponse } from 'src/app/data/models/part-template';
import { TemplateService } from 'src/app/data/services/part-template/part-template.service';
import { PART_ATTRIBUTE_TABLE} from 'src/app/data/constants/part-attribute-table.constants';
import { TemplateDialogComponent } from 'src/app/modules/config/components/template-dialog/template-dialog.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ConfirmDialogComponent, ConfirmDialogData } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-parts-form',
  templateUrl: './parts-form.component.html',
  styleUrls : ['./parts-form.component.scss']
})
export class PartsFormComponent implements OnDestroy {
  partNames: string[] =[];
  partTypes: string[] = [];
  partUnits: string[] = [];
  partCategories: {categoryId: number, categoryName: string}[] = [];
  vendorList: Vendor[] = [];
  costFactorList: CostFactor[] = [];
  subscriptions: Subscription[] = [];
  COST_FACTOR_TABLE_COLUMNS = COST_FACTOR_TABLE_COLUMNS;
  BOM_TABLE_COLUMNS = BOM_TABLE_COLUMNS;
  vendorCostMap: Map<number, CostFactorData[]> = new Map();
  bomPartList: PartBomData[] =[]; 
  pageSize: number = 100 // Default items per page
  partTypeEnum= PartType;
  selectedFiles: File[] = [];
  maxFiles = 3;
  isDragOver = false;
  @ViewChild('attributeNameWithWarning', { static: false }) 
  attributeNameWithWarning!: TemplateRef<any>;
  readonly allowedFileTypes = [
    'image/png', 'image/jpeg', 'image/jpg', 'image/gif',
    'application/pdf', 'text/csv', 'text/plain', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  selectedStepIndex: number = 0;
  attributeValueList:PartAttributeValue[]=[]
  isEditMode = false;
  
  uploadedFiles: string[] = [];

  partForm = new FormGroup({
    partNumber: new FormControl('', Validators.required),
    partName: new FormControl('', Validators.required),
    categoryId: new FormControl(),
    partType: new FormControl('', Validators.required),
    partUnit: new FormControl('', Validators.required),
  });

  costDetailsForm = new FormGroup({
    costFactors: new FormArray([])
   });

templateControl = new FormControl();
filteredTemplates!: Observable<TemplateResponse[]>;
selectedTemplateAttributes: AttributeRow[] = [];
attributeTableColumns: any[] = [];
  selectedVendor: Vendor = undefined as any;
  filesToDelete: string[] = [];
  existingFiles: string[] = [];



  // selectedPart: PartRow | null = null;

  PartCreateRequest: any;
  partId: string | null = null;
  @ViewChild('previewDialog') previewDialog!: TemplateRef<any>;
  partFilePreviews: { url: string, type: string, previewUrl?: string }[] = [];


  constructor(private partService: PartService, private vendorService: VendorService, private overlayContainer: OverlayContainer, private costFactorService: CostFactorService,     private route: ActivatedRoute,
    private router: Router, private dialog: MatDialog, public snackbarService: SnackbarService, private templateService: TemplateService) {
      
    }

    displayTemplate(template: TemplateResponse): string {
    return template ? template.templateName : '';
  }

   onAutocompleteOpened() {
    this.overlayContainer.getContainerElement().classList.add('autocomplete-open');
  }

  onAutocompleteClosed() {
    this.overlayContainer.getContainerElement().classList.remove('autocomplete-open');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.attributeTableColumns = PART_ATTRIBUTE_TABLE(true, this.attributeNameWithWarning);
    });
  }



    ngOnInit(): void{
      this.partId = this.route.snapshot.paramMap.get('id');
    this.getPartTypes();
    this.getPartUnits();
    this.getPartCategories();
    this.getVendorList();
    this.getCostFactors();
    this.setupTemplateFilter();
      this.isEditMode = !!this.partId;
      if (this.partId){
        this.partForm.get('partNumber')?.disable();
        this.getPartData(this.partId);
       this.getPartFiles(this.partId || '');
      }
      this.partForm.get('partType')?.valueChanges.subscribe((value) => {
        if (value === this.partTypeEnum.MASTER) {
          this.clearVendorCostData();
        }
      });
      }
      
  getPartFiles(partId: string): void {
  this.partService.getPartFiles(partId).subscribe({
    next: (urls) => {
      this.partFilePreviews = urls.map(url => {
        const type = this.getFileTypeFromName(url);
        const fileObj: any = { url, type };
        if (type === 'image') {
          this.partService.downloadPartFile(url).subscribe((response: any) => {
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

onFilesSelected(event: any) {
  const files: FileList = event.target.files;
  if (files && files.length > 0) {
    this.processFiles(Array.from(files));
  }
}

allowDrop(event: DragEvent): void {
  this.isDragOver = true;
  event.preventDefault();
  event.stopPropagation();
}

handleDrop(event: DragEvent): void {
  this.isDragOver = false;
  event.preventDefault();
  event.stopPropagation();
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    this.processFiles(Array.from(files));
  }
}

dragLeave(event: DragEvent): void {
  this.isDragOver = false;
  event.preventDefault();
  event.stopPropagation();
}

processFiles(files: File[]): void {
  const validFiles = files.filter(file => this.allowedFileTypes.includes(file.type));
  if (validFiles.length < files.length) {
    this.snackbarService.error('Some files were not allowed and have been skipped.');
  }
  const remainingSlots = this.maxFiles - this.selectedFiles.length;
  if (validFiles.length > remainingSlots) {
    this.snackbarService.error(`You can upload maximum ${this.maxFiles} files.`);
    return;
  }
  for (const file of validFiles) {
    this.selectedFiles.push(file);
  }
}
removeFile(index: number) {
  this.selectedFiles.splice(index, 1);
}

getFileTypeFromName(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) return 'other';
    if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'word';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'excel';
    return 'other';
  }
  getFileNameFromUrl(fileUrl: string): string {
  return fileUrl.split('/').pop() || fileUrl;
}

getImagePreview(file: File): string {
  return URL.createObjectURL(file);
}



getFileType(file: any): string {
  const type = (file.type || '').toLowerCase();
  if (type.startsWith('image/')) return 'image';
  if (type === 'application/pdf') return 'pdf';
  if (
    type === 'application/msword' ||
    type.includes('wordprocessingml')
  ) return 'word';
  if (
    type === 'application/vnd.ms-excel' ||
    type.includes('spreadsheetml')
  ) return 'excel';
  return 'other';
}

setupTemplateFilter() {
  this.filteredTemplates = this.templateControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(value => {
        const filterValue = value ?? '';
      const filterCriteria = new Map<string, string>();
      filterCriteria.set('templateName', filterValue);

      return this.templateService.getTemplateList(0, 10, filterCriteria);
    }),
    map(response => response.data || response.templates || [])
  );
}


      getPartData(id: string): void {
        
    this.partService.getPartById(id).subscribe((part) => {
      const matchedCategory = this.partCategories.find(
        cat => cat.categoryName === part.categoryName
      );
          this.partForm.patchValue({
            partNumber: getValueOrNull(part.partNumber),
            partName: getValueOrNull(part.partName),
            categoryId: matchedCategory?.categoryId,
            partType: getValueOrNull(part.type),
            partUnit: getValueOrNull(part.unit)
          });

          this.vendorCostListToMap(part.vendorCostList);

          this.bomPartList = part.bom?.map(bomPart => ({
            id: bomPart.childPartId,
            partName: bomPart.childPartName,
            partNumber: bomPart.childPartNumber,
            value: getValueOrNull(bomPart.quantity)
          })) || [];

          this.attributeValueList= part.attributeValueList?.map(attr=>({
            attributeId:attr.attributeId,
            attributeName: attr.attributeName,
            value:attr.value,
            deleteFlag:attr.deleteFlag
          }))|| [];


          console.log(part);
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

  isFormValidForSubmit(): boolean {
    return this.partForm.valid;
  }
  
  onStepChange(event: any) {
    this.selectedStepIndex = event.selectedIndex;
}

  clearVendorCostData(): void {
    this.vendorCostMap.clear();
    this.costDetailsForm.reset();
  }
  

  onModifyClick(): void {
  const currentAttributeIds = new Set(this.attributeValueList.map(attr => attr.attributeId));

  const dialogRef = this.dialog.open(TemplateDialogComponent, {
    width: '37.5rem',
    data: {
      existingAttributes: currentAttributeIds,
      buttonLabel: 'Add/Update Attribute'
    }
  });

  dialogRef.afterClosed().subscribe(result => {

    if (result?.action === DialogCloseResponse.UPDATE && result?.data) {
      const updatedAttributes = result.data as AttributeRow[];

      let isDifferent = false;

       const deletedAttributes = this.attributeValueList.filter(attr => attr.deleteFlag === 1);

        const existingMap = new Map(this.attributeValueList.map(attr => [attr.attributeId, attr]));
        const newAttributeValueList = updatedAttributes.map(newAttr => {
        const existing = existingMap.get(newAttr.attributeId);
        if (!existing) {
          isDifferent = true;
        }

        return {
          attributeId: newAttr.attributeId,
          attributeName: newAttr.attributeName,
          value: existing?.value || ''
        };
        });
        if (updatedAttributes.length !== this.attributeValueList.length) {
        isDifferent = true;
      }
    this.attributeValueList = [...newAttributeValueList, ...deletedAttributes];

    if (isDifferent) {
      this.templateControl.setValue("");
    }
    }
  });
  }

  removeDeletedAttribute(attrToRemove: PartAttributeValue): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to remove <strong>${attrToRemove.attributeName}</strong>?`
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === DialogCloseResponse.DELETE) {
        this.attributeValueList = this.attributeValueList.filter(
          attr => attr.attributeId !== attrToRemove.attributeId
        );
      }
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
      width: '37.5rem',
      data: { 
        existingParts: new Set(this.bomPartList.map(part => part.id) || []),
        excludePartId: this.partId 
      },
      autoFocus:false
    });
  
    dialogRef.afterClosed().subscribe((res: {data: any, action: DialogCloseResponse}) => {
      if(res.action == DialogCloseResponse.UPDATE) {
        this.handleDialogClose(res?.data);
      }
    });
  }
  
  handleDialogClose(selectedParts: Set<PartRow>): void 
  {
    if (!selectedParts || selectedParts.size === 0){
      this.bomPartList = [];
    }

    selectedParts.forEach(part => {
      const exists = this.bomPartList.find(existingPart => part.partId == existingPart.id);
      if(!exists) {
        this.bomPartList.push({
          id:part.partId,
          partName:part.partName,
          partNumber:part.partNumber,
          value:0,
        })
      }
    });

    // check if sme pat exist in bomPartList but not in selectedPart then delete that part from list
  
    this.bomPartList = this.bomPartList.filter(existingPart =>{
      let filter = false;
      selectedParts.forEach(p => {
        if(p.partId === existingPart.id) {
          filter = true;
        }
      });
      return filter;
    });
  }
  


  getVendorName(vendorId: number): string {
    const vendor = this.vendorList.find(v => v.id === vendorId);
    return vendor?.vendorName || 'Unknown Vendor';
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

  deleteVendorFromMap(vendorId: number): void {
    this.vendorCostMap.delete(vendorId); // Directly remove vendor
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
      this.costFactorService.getCostFactorList().subscribe((res) => {
        this.costFactorList = res?.data || res;
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

  handleAction(event: { action: TableActions; row: any }, vendorId: number) {
    const { action, row } = event;
    if (action === TableActions.DELETE) {
      this.removeCostFactor(row, vendorId);
    }
  }

  removeCostFactor(costFactorToRemove: CostFactorData, vendorId: number) {
    const costFactors = this.vendorCostMap.get(vendorId);
  
    if (costFactors) {
      const updatedCostFactors = costFactors.filter(cf => cf.id !== costFactorToRemove.id);
      this.vendorCostMap.set(vendorId, updatedCostFactors);
    }
  }
  
  bomDetailsForm = new FormGroup({
    masterParts: new FormArray([]),
  });

  
  get masterParts() {
    return this.bomDetailsForm.get('masterParts') as FormArray;
  }
  
  addCostFactorFromFieldValue(index: number, vendorId: number) {
    const selectedValue = this.costFactors.at(index)?.value
    this.addCostFactor(selectedValue, vendorId);
  }

  addCostFactor(costFactor:CostFactorData, vendorId: number) {
    if (costFactor) {
      const currentList = this.vendorCostMap.get(vendorId) || [];
      const isPresent = currentList?.some((cf: CostFactorData) => cf?.factorName === costFactor?.factorName);

      if (!isPresent) { 
        currentList.push({
          id: costFactor.id,
          factorName: costFactor.factorName,
          value: costFactor.value || 0
        } as CostFactorData);
  
        this.vendorCostMap.set(vendorId, currentList);
      }
    }
  }
  goToNextStep(stepper: MatStepper): void {
    if (this.partForm.invalid) {
      this.snackbarService.error('Please fill all required fields!');
      return;
    }
  
    stepper.next();
    this.selectedStepIndex = stepper.selectedIndex;
  }

onTemplateSelected(selectedTemplate: TemplateResponse): void {

  this.selectedTemplateAttributes = [];

  if (!selectedTemplate?.templateId) return;

  this.templateService.getTemplateById(selectedTemplate.templateId).subscribe({
    next: (fullTemplate: TemplateResponse) => {
      const attributes = fullTemplate.partAttributes ?? [];

      this.selectedTemplateAttributes = attributes;

    this.attributeValueList = attributes.map(attr => ({
      attributeId:attr.attributeId,
      attributeName: attr.attributeName,
      value: "",
    }))
    }
  });
}


  

  onSubmit(): void {
  if (!this.isFormValid()) return;
  if (!this.areVendorCostValuesValid()) return;
  if (!this.areBomQuantitiesValid()) return;

  const body: PartCreateRequest = this.buildPartCreateRequest();
  const dialogRef = this.openProgressDialogIfNeeded();

  if (this.partId) {
    this.updatePart(body, dialogRef);
  } else {
    this.createPart(body, dialogRef);
  }
}

//Helper Methods

private isFormValid(): boolean {
  if (this.partForm.invalid) {
    this.snackbarService.error('Please fill all required fields!');
    return false;
  }
  return true;
}

private areVendorCostValuesValid(): boolean {
  for (const [, costFactors] of this.vendorCostMap) {
    for (const costFactor of costFactors) {
      if (!costFactor.value || costFactor.value === 0) {
        this.snackbarService.error('Cost Factor value cannot be 0');
        return false;
      }
    }
  }
  return true;
}

private areBomQuantitiesValid(): boolean {
  for (const part of this.bomPartList) {
    if (!part.value || Number(part.value) === 0) {
      this.snackbarService.error('Quantity of the child parts cannot be 0');
      return false;
    }
  }
  return true;
}

private buildPartCreateRequest(): PartCreateRequest {
  return {
    partName: this.partForm.get('partName')?.value || '',
    partNumber: this.partForm.get('partNumber')?.value || '',
    type: this.partForm.get('partType')?.value || '',
    unit: this.partForm.get('partUnit')?.value || '',
    vendorCostList: this.generateVendorCostMapBody(),
    categoryId: this.partForm.get('categoryId')?.value || null,
    bom: this.generateBomDetailsBody(),
    attributeValueList: this.generateAttributesBody()
  };
}

private openProgressDialogIfNeeded(): any {
  if (this.selectedFiles.length > 0) {
    return this.dialog.open(ProgressDialogComponent, {
      disableClose: true,
      data: { step: 0, uploadProgress: 0, fileName: '', fileSize: 0 }
    });
  }
  return null;
}

private updatePart(body: PartCreateRequest, dialogRef: any): void {
  this.partService.updatePart(this.partId!, body).pipe(
    concatMap(() => {
      const partId = Number(this.partId);

      const deleteObservables = this.filesToDelete.map(fileKey =>
        this.partService.deletePartFile(partId, fileKey)
      );

      const uploadObservables = this.selectedFiles.map(file =>
        from(fileToBase64(file)).pipe(
          concatMap(base64 => this.partService.uploadPartImage(partId, file, base64))
        )
      );

      const allRequests = [...deleteObservables, ...uploadObservables];

      if (allRequests.length === 0) {
        this.snackbarService.success('Part updated successfully!');
        this.router.navigateByUrl('/app/parts');
        return of(null);
      }

      this.handleDialogStep(dialogRef, 1);
      return concat(...allRequests);
    })
  ).subscribe({
    next: () => {
      this.handleDialogStep(dialogRef, 2);
      setTimeout(() => dialogRef?.close(), 1500);
      this.snackbarService.success('Part updated successfully!');
      this.router.navigateByUrl('/app/parts');
      this.filesToDelete = [];
    },
    error: (err) => {
      dialogRef?.close();
      this.snackbarService.error('Failed to update part or files.');
      console.error(err);
    }
  });
}


removeUploadedFile(fileUrl: string): void {
  const index = this.partFilePreviews.findIndex(file => file.url === fileUrl);
  if (index !== -1) {
    const fileToRemove = this.partFilePreviews[index];

    const key = fileToRemove.url;
    this.filesToDelete.push(key);

    this.partFilePreviews.splice(index, 1);
  }
}


private createPart(body: PartCreateRequest, dialogRef: any): void {
  this.partService.createPart(body).pipe(
    concatMap((res: any) => {
      if (this.selectedFiles.length === 0) {
        this.snackbarService.success('Part created successfully!');
        this.router.navigateByUrl('/app/parts');
        return of(null);
      }
      this.handleDialogStep(dialogRef, 1);
      const partId = res.partId || res.id;
      const uploadObservables = this.selectedFiles.map(file =>
        from(fileToBase64(file)).pipe(
          concatMap(base64 => this.partService.uploadPartImage(partId, file, base64))
        )
      );
      return concat(...uploadObservables);
    })
  ).subscribe({
    next: () => {
      this.handleDialogStep(dialogRef, 2);
      setTimeout(() => dialogRef?.close(), 1500);
      if (this.selectedFiles.length > 0) {
        this.snackbarService.success('Part created successfully!');
      }
      this.router.navigateByUrl('/app/parts');
    },
    error: (err) => {
      dialogRef?.close();
      this.snackbarService.error('Failed to upload part or files.');
      console.error(err);
    }
  });
}

private handleDialogStep(dialogRef: any, step: number): void {
  if (dialogRef) {
    dialogRef.componentInstance.data.step = step;
  }
}

generateAttributesBody() {
  return this.attributeValueList.map((attr: any) => ({
    attributeId: attr.attributeId,
    value: attr.value
  }));
}

  generateBomDetailsBody() {
    return this.bomPartList.map(part => ({
      childPartId: part.id,
      quantity: Number(part.value),
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
