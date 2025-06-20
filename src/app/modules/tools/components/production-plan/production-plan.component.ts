import { Component, OnInit } from "@angular/core";
import { PartService } from "src/app/data/services/part/part.service";
import { PartRow, SortState } from "src/app/data/models/part";
import { Subject, debounceTime, distinctUntilChanged } from "rxjs";
import { SortIcons } from "src/app/shared/constants/table.constants";
import { getValueOrNull } from "src/app/shared/utils/string.util";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-production-plan",
  templateUrl: "./production-plan.component.html",
  styleUrl: "./production-plan.component.scss",
})
export class ProductionPlanComponent implements OnInit {
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
  existingParts: Set<number> = new Set();
  allParts: PartRow[] = [];
  paginatedData: any[] = [];
  pageSize: number = 100;
  currentPage: number = 0;
  totalRecords: number = 0;
  pageInfo: any;
  searchTerm: any;
  filteredPartList: PartRow[] = [];
searchTerms: { [key: string]: string } = {
  partName: '',
  partNumber: '',
  type: '',
  unit: '',
  categoryName: ''
};
  sortMode: string = SortIcons.ASC;
  sortColumn: string = "partNumber";
  sortState: SortState = { sortColumn: "partNumber", sortState: SortIcons.ASC };

  filterCriteria: Map<string, string> = new Map();
  private searchSubject = new Subject<{ key: string; value: string }>();
  data: any;

  constructor(private partService: PartService) {}

  ngOnInit(): void {
    this.getPartList();
    this.listenToFilterChanges();
  }

  getPartList(): void {
    this.partService
      .getPartList(
        this.currentPage,
        this.pageSize,
        this.filterCriteria,
        this.sortColumn,
        this.sortState
      )
      .subscribe((res) => {
        this.partList = getValueOrNull(res.data?.partsList);
        const mappedParts = this.partList.map((part) => part.partName);
        // this.existingParts = this.data.existingParts;
        this.paginatedData = this.partList;
        this.totalRecords = getValueOrNull(res.pageInfo?.totalRecords);
        this.allParts = [...this.allParts, ...this.partList];
        this.allParts = Array.from(
          new Set(this.allParts.map((part) => part.partId))
        ).map((id) => this.allParts.find((part) => part.partId === id)!);
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

  getSortIcon(key: string): string {
    return this.sortState.sortColumn === key
      ? this.sortState.sortState === SortIcons.ASC
        ? SortIcons.ASC
        : SortIcons.DESC
      : SortIcons.DEFAULT;
  }

  listenToFilterChanges(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => prev.value === curr.value)
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.getPartList();
      });
  }

  applyFilter(): void {
  // Loop through all filter keys
  Object.entries(this.searchTerms).forEach(([key, value]) => {
    if (value) {
      this.filterCriteria.set(key, value);
      this.searchSubject.next({ key, value });
    } else {
      this.filterCriteria.delete(key);
    }
  });

  const filterObject = Object.fromEntries(this.filterCriteria);
  this.searchSubject.next({
    key: "update",
    value: JSON.stringify(filterObject),
  });
}

  toggleSelection(partId: number, checked: boolean) {
    if (checked) {
      this.selectedPartIds.add(partId);
    } else {
      this.selectedPartIds.delete(partId);
    }
  }

  isSelected(partId: number): boolean {
    return this.selectedPartIds.has(partId);
  }

  selectAll(event: any) {
    if (event.checked) {
      this.partList.forEach((part) => this.selectedPartIds.add(part.partId));
    } else {
      this.partList.forEach((part) => this.selectedPartIds.delete(part.partId));
    }
  }

  isAllSelected(): boolean {
    return (
      this.partList.length > 0 &&
      this.partList.every((part) => this.selectedPartIds.has(part.partId))
    );
  }

  isIndeterminate(): boolean {
    return (
      this.partList.some((part) => this.selectedPartIds.has(part.partId)) &&
      !this.isAllSelected()
    );
  }

  onPageChange(event: PageEvent) {
      this.pageSize = event.pageSize;
      this.currentPage = event.pageIndex;
      this.getPartList();
    }
}
