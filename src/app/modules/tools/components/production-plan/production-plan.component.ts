import { Component, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { PartService } from "src/app/data/services/part/part.service";
import { PartRow, SortState } from "src/app/data/models/part";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { SortIcons } from "src/app/shared/constants/table.constants";
import { getValueOrNull } from "src/app/shared/utils/string.util";
import { PageEvent } from "@angular/material/paginator";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { PricingOptions } from "src/app/shared/constants/pricingoptions.constants";
import { ProductionPlanService } from "src/app/data/services/production-plan/production-plan.service";
import { ProductionCostResponse, ProductionPlanRequest } from "src/app/data/models/production-plan";

@Component({
  selector: "app-production-plan",
  templateUrl: "./production-plan.component.html",
  styleUrl: "./production-plan.component.scss",
})
export class ProductionPlanComponent implements OnInit, OnDestroy {
  partList: PartRow[] = [];
  selectedPartIds: Set<number> = new Set();
  displayedColumns: string[] = [
    "select",
    "partNumber",
    "partName",
    "unit",
    "type",
    "categoryName",
  ];
  pageSize: number = 100;
  currentPage: number = 0;
  totalRecords: number = 0;
  partSelectionForm: FormGroup;
  planForm: FormGroup;
  selectedParts: PartRow[] = [];
  productionCostResponse: ProductionCostResponse | null = null;
  sortMode: string = SortIcons.ASC;
  sortColumn: string = "partNumber";
  sortState: SortState = { sortColumn: "partNumber", sortState: SortIcons.ASC };
  filterCriteria: Map<string, string> = new Map();
  selectedStepIndex: number = 0;
  displayResultTableColumns = ['partNumber', 'partName', 'quantity', 'rate', 'subTotal', 'vendorName'];
   hasUnsavedChanges = true;
  @ViewChild('stepper') stepper!: MatStepper;
   @HostListener('window:beforeunload', ['$event'])
  unloadNotification(event: BeforeUnloadEvent) {
    if (this.hasUnsavedChanges) {
      event.preventDefault();
      event.returnValue = ''; // required for Chrome
    }
  }

  constructor(private partService: PartService, private fb: FormBuilder, private productionPlanService: ProductionPlanService) {
    // Add filter controls to the form group
    this.partSelectionForm = this.fb.group({
      partNumber: [''],
      partName: [''],
      unit: [''],
      type: [''],
      categoryName: [''],
      // Add more controls for selection if needed
    });
    this.planForm = this.fb.group({
      pricingMode: [this.pricingOptions[0].value, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getPartList();
    // Listen for filter changes
    this.partSelectionForm.valueChanges.pipe(debounceTime(300),
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
  )
  .subscribe(() => {
    this.applyFilter();
  });
  }

  getPartList(): void {
    this.partService
      .getPartList(
        this.currentPage,
        this.pageSize,
        this.filterCriteria,
        this.sortState
      )
      .subscribe((res) => {
        this.partList = getValueOrNull(res.data?.partsList) || [];
        this.totalRecords = getValueOrNull(res.pageInfo?.totalRecords) || 0;
      
      });
  }


  toggleSort(key: string): void {
    this.sortState = {
      sortColumn: key,
      sortState:
        this.sortState.sortColumn !== key
          ? SortIcons.ASC
          : this.sortState.sortState === SortIcons.ASC
          ? SortIcons.DESC
          : SortIcons.ASC,
    };
    this.applySort(this.sortState);
  }

  applySort(sort: SortState): void {
    this.sortState = sort;
    this.getPartList();
  }

  ngOnDestroy():void{
    // this.resetPlan();
    console.log("Destroyed")
  }

  getSortIcon(key: string): string {
    return this.sortState.sortColumn === key
      ? this.sortState.sortState === SortIcons.ASC
        ? SortIcons.ASC
        : SortIcons.DESC
      : SortIcons.DEFAULT;
  }

  applyFilter(): void {
    const filters = this.partSelectionForm.value;
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        this.filterCriteria.set(key, String(value));
      } else {
        this.filterCriteria.delete(key);
      }
    });

    this.currentPage = 0;
    this.getPartList();
  }

  toggleSelection(part:PartRow, checked: boolean) {
    if (checked) {
      this.selectedPartIds.add(part.partId);
    } else {
      this.selectedPartIds.delete(part.partId);
    }
  }

  isSelected(partId: number): boolean {
    return this.selectedPartIds.has(partId);
  }

  selectAll(event: { checked: boolean }) {
    if (event.checked) {
      this.partList.forEach((part) => this.selectedPartIds.add(part.partId));
    } else {
      this.selectedPartIds.clear();
    }
  }

  isAllSelected(): boolean {
    return (
      this.partList.length > 0 &&
      this.selectedPartIds.size === this.partList.length
    );
  }

  isIndeterminate(): boolean {
    return (
      this.selectedPartIds.size > 0 && this.selectedPartIds.size < this.partList.length
    );
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPartList();
  }

  onStepChange(event: any) {
    this.selectedStepIndex = event.selectedIndex;
  }

goToNextStep(stepper: MatStepper) {
  if (this.selectedPartIds.size === 0) return;

  this.selectedParts = [
    ...this.selectedParts.filter(p => this.selectedPartIds.has(p.partId)),
    ...this.partList.filter(part => this.selectedPartIds.has(part.partId) && !this.selectedParts.some(p => p.partId === part.partId))
  ];
  this.preparePlanForm();
  stepper.next();
}



pricingOptions = Object.values(PricingOptions);

preparePlanForm() {
  if (!this.planForm) {
    this.planForm = this.fb.group({
      pricingMode: [this.pricingOptions[0].value, Validators.required],
    });
  }
  this.selectedParts.forEach(part => {
    this.planForm.addControl(`quantity_${part.partId}`, this.fb.control(1, [Validators.required, Validators.min(1)]));
  });
}

planProduction(stepper: MatStepper) {
  const request: ProductionPlanRequest = {
    priceMode: this.planForm.get('pricingMode')?.value,
    parts: this.selectedParts.map(part => ({
      partId: part.partId,
      quantity: this.planForm.get(`quantity_${part.partId}`)?.value
    }))
  };

  console.log('Production Plan Request:', request);

  this.productionPlanService.calculateProductionCost(request).subscribe({
    next: (response: ProductionCostResponse) => {
      console.log('Production Cost Response:', response);
      this.productionCostResponse = response;
      stepper.next();
    },
    error: err => console.error('Production plan calculation failed', err)
  });
}

resetPlan(): void {
  this.selectedPartIds.clear();
  this.selectedParts = [];
  this.productionCostResponse = null;
  this.partSelectionForm.reset();
  this.planForm.reset();
  this.selectedStepIndex = 0;
  this.stepper?.reset();
  this.getPartList();
}

    getTotalQuantity(): number {
    return this.productionCostResponse?.items.reduce((total, item) => total + item.quantity, 0) || 0;
  }

  getTotalCost(): number {
    return this.productionCostResponse?.totalCost || 0;
  }
}
