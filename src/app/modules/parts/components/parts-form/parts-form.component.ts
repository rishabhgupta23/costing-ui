import { Component, OnDestroy} from '@angular/core';
import { PartService } from '../../../../data/services/part/part.service';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, Subscription, switchMap } from 'rxjs';
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
import { ListItem } from 'src/app/data/models/list-items';
import { CostFactorService } from 'src/app/data/services/cost-factor/cost-factor.service';
import { AttributeRow, TemplateResponse } from 'src/app/data/models/part-template';
import { TemplateService } from 'src/app/data/services/part-template/part-template.service';
import { ATTRIBUTE_TABLE_COLUMNS } from 'src/app/data/constants/attribute-table.constants';
import { TemplatedialogComponent } from 'src/app/modules/config/components/templatedialog/templatedialog.component';
import { OverlayContainer } from '@angular/cdk/overlay';


@Component({
  selector: 'app-parts-form',
  templateUrl: './parts-form.component.html',
  styleUrls : ['./parts-form.component.scss']
})
export class PartsFormComponent implements OnDestroy {
onModifyClick(): void {
  const currentAttributeIds = new Set(this.attributeValueList.map(attr => attr.attributeId));

  const dialogRef = this.dialog.open(TemplatedialogComponent, {
    width: '600px',
    data: {
          openedFromPartForm: true,
      existingAttributes: currentAttributeIds,
      isEditMode: false
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result?.action === DialogCloseResponse.UPDATE && result?.data) {
      const updatedAttributes = result.data as AttributeRow[];

const currentIds = this.attributeValueList.map(a => a.attributeId).sort();
const updatedIds = updatedAttributes.map(a => a.attributeId).sort();

const isDifferent =
  currentIds.length !== updatedIds.length ||
  currentIds.some((id, idx) => id !== updatedIds[idx]);


      this.attributeValueList = updatedAttributes.map(newAttr => {
        const existing = this.attributeValueList.find(a => a.attributeId === newAttr.attributeId);
        return {
          attributeId: newAttr.attributeId,
          attributeName: newAttr.attributeName,
          value: existing?.value || ''
        };
      });

if (isDifferent) {
    this.templateControl.setValue("");
}
    }
  });
}

  partNames: string[] =[];
  partTypes: string[] = [];
  partUnits: string[] = [];
  partCategories: {categoryId: number, name: string}[] = [];
  vendorList: Vendor[] = [];
  costFactorList: CostFactor[] = [];
  subscriptions: Subscription[] = [];
  COST_FACTOR_TABLE_COLUMNS = COST_FACTOR_TABLE_COLUMNS;
  BOM_TABLE_COLUMNS = BOM_TABLE_COLUMNS;
  vendorCostMap: Map<number, CostFactorData[]> = new Map();
  bomPartList: PartBomData[] =[]; 
  pageSize: number = 100 // Default items per page
  partTypeEnum= PartType;
  selectedStepIndex: number = 0;
  templates: TemplateResponse[] = [];
  attributeValueList:PartAttributeValue[]=[]
  isEditMode = false;
  

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
attributeTableColumns= ATTRIBUTE_TABLE_COLUMNS (true);
  selectedVendor: Vendor = undefined as any;

  // selectedPart: PartRow | null = null;

  PartCreateRequest: any;
  partId: string | null = null;


  constructor(private partService: PartService, private vendorService: VendorService, private overlayContainer: OverlayContainer, private costFactorService: CostFactorService,     private route: ActivatedRoute,
    private router: Router, private dialog: MatDialog, private snackbarService: SnackbarService, private templateService: TemplateService) {
      
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
        this.getPartData(this.partId);
      }
      this.partForm.get('partType')?.valueChanges.subscribe((value) => {
        if (value === this.partTypeEnum.MASTER) {
          this.clearVendorCostData();
        }
      });
      }

setupTemplateFilter() {
  this.filteredTemplates = this.templateControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(value => {
      const filterValue = (typeof value === 'string' ? value : value?.templateName) || '';
      const filterCriteria = new Map<string, string>();
      filterCriteria.set('templateName', filterValue);

      return this.templateService.getTemplateList(0, 10, filterCriteria);
    }),
    map(response => response.data || response.templates || [])
  );
}


      getPartData(id: string): void {
        this.partService.getPartById(id).subscribe((part) => {
          this.partForm.patchValue({
            partNumber: getValueOrNull(part.partNumber),
            partName: getValueOrNull(part.partName),
            categoryId: part.categoryName,
            partType: getValueOrNull(part.type),
            partUnit: getValueOrNull(part.unit)
          });

              if (part.categoryName) {
      this.partForm.get('categoryId')?.setValue(part.categoryName);
    }

          this.vendorCostListToMap(part.vendorCostList);

          this.bomPartList = part.bom?.map(bomPart => ({
            id: bomPart.childPartId,
            partName: bomPart.childPartName,
            partNumber: bomPart.childPartNumber,
            value: getValueOrNull(bomPart.quantity)
          })) || [];

          this.attributeValueList= part.attributes?.map(attr=>({
            attributeId:attr.attributeId,
            attributeName: attr.attributeName,
            value:attr.value
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
        existingParts: new Set(this.bomPartList.map(part => part.id) || [])
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
    const categoryIdValue = this.partForm.get('categoryId')?.value || null;
    const body: PartCreateRequest = {
      partName: this.partForm.get('partName')?.value || '',
      partNumber: this.partForm.get('partNumber')?.value || '',
      type: this.partForm.get('partType')?.value || '',
      unit: this.partForm.get('partUnit')?.value || '',
      vendorCostList: this.generateVendorCostMapBody(),
      categoryId: this.partForm.get('categoryId')?.value.categoryId || null,
      bom: this.generateBomDetailsBody(),
      attributeValueList: this.generateAttributesBody()
    };

    if (this.partForm.invalid) {
      this.snackbarService.error('Please fill all required fields!');
      return;
    }

    for (const [vendorId, costFactors] of this.vendorCostMap) {
      for (const costFactor of costFactors) {
        if (!costFactor.value || costFactor.value === 0) {
          this.snackbarService.error('Cost Factor value cannot be 0');
          return;
        }
      }
    }
    

    for (const part of this.bomPartList) {
      if (!part.value || Number(part.value) === 0) {
        this.snackbarService.error('Quantity of the child parts cannot be 0');
        return;
      }
    }
    if (this.partId) {
      this.partService.updatePart(this.partId, body).subscribe({
        next: () => {
            this.snackbarService.success('Part updated successfully!');
            this.router.navigateByUrl('/app/parts');
        }
      });
    } else {
      this.partService.createPart(body).subscribe({
        next:() => {
            this.snackbarService.success('Part created successfully!');
            this.router.navigateByUrl('/app/parts');
        }
      });
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
