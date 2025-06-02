import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ListItem } from 'src/app/data/models/list-items';
import { SortState } from 'src/app/data/models/part';
import { PartAttributeService } from 'src/app/data/services/part-attribute/part-attribute.service';
import { DialogCloseResponse } from 'src/app/shared/constants/dialog.constants';
import { SortIcons } from 'src/app/shared/constants/table.constants';
import { AttributeRow } from 'src/app/data/models/part-template';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-templatedialog',
  templateUrl: './templatedialog.component.html',
  styleUrl: './templatedialog.component.scss'
})
export class TemplatedialogComponent implements OnInit {
  displayedColumns: string[] = ['select', 'attributeName'];
  attributeList: AttributeRow[] = [];
  allAttributes: AttributeRow[] = [];
  existingAttributes: Set<number> = new Set();
  templateName: string = '';
  isEditMode: boolean = false;
  openedFromPartForm: boolean = false;
  pageSize: number = 100;
  currentPage: number = 0;
  totalRecords: number = 0;

  searchTerm: string = '';
  filterCriteria: Map<string, string> = new Map();

  sortState: SortState = { sortColumn: 'attributeName', sortState: SortIcons.ASC };
  private searchSubject = new Subject<{ key: string; value: string }>();

  constructor(
    public dialogRef: MatDialogRef<TemplatedialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      openedFromPartForm: boolean;
      templateName: string;existingAttributes: Set<number> 
      isEditMode?: boolean;
},
    private attributeService: PartAttributeService
  ) {}

  ngOnInit(): void {
      this.openedFromPartForm = this.data?.openedFromPartForm ?? false;
    this.existingAttributes = new Set(this.data.existingAttributes);
    this.existingAttributes = new Set(this.data.existingAttributes);
    this.templateName = this.data.templateName || ''; // <-- Add this
    this.isEditMode = !!this.data.isEditMode;
    this.getAttributeList();
    this.listenToFilterChanges();
  }

  listenToFilterChanges(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => prev.value === curr.value)
    ).subscribe(() => {
      this.currentPage = 0;
      this.getAttributeList();
    });
  }

  applyFilter(): void {
    if (this.searchTerm) {
      this.filterCriteria.set('attributeName', this.searchTerm);
    } else {
      this.filterCriteria.delete('attributeName');
    }
    this.searchSubject.next({ key: 'attributeName', value: this.searchTerm });
  }

  getSortIcon(key: string): string {
    return this.sortState.sortColumn === key
      ? (this.sortState.sortState === SortIcons.ASC ? SortIcons.ASC : SortIcons.DESC)
      : SortIcons.DEFAULT;
  }
  
  
  toggleSort(key: string): void {
    this.sortState = {
      sortColumn: key, sortState: this.sortState.sortColumn !== key ? SortIcons.ASC : 
          this.sortState.sortState === SortIcons.ASC ? SortIcons.DESC : SortIcons.ASC
    };
    this.applySort(this.sortState);
  }

  applySort(sort:SortState): void {
    this.sortState=sort;
    this.getAttributeList();
    }

  getAttributeList(): void {
    this.attributeService.getPartAttributeList(
      this.currentPage,
      this.pageSize,
      this.filterCriteria,
      this.sortState
    ).subscribe((res) => {
      this.attributeList = res.data || [];
      this.totalRecords = res.pageInfo?.totalRecords || 0;
      this.allAttributes = [...this.allAttributes, ...this.attributeList];
      this.allAttributes = Array.from(new Set(this.allAttributes.map(attr => attr.attributeId)))
        .map(id => this.allAttributes.find(attr => attr.attributeId === id)!);
    });
  }

  toggleAttributeSelection(attr: AttributeRow, event: any): void {
    if (event.checked) {
      this.existingAttributes.add(attr.attributeId);
    } else {
      this.existingAttributes.delete(attr.attributeId);
    }
  }

  isAllSelected(): boolean {
    return this.attributeList.length > 0 && this.attributeList.every(attr => this.existingAttributes.has(attr.attributeId));
  }

  isIndeterminate(): boolean {
    return this.attributeList.some(attr => this.existingAttributes.has(attr.attributeId)) &&
           !this.isAllSelected();
  }

  selectAll(event: any): void {
    if (event.checked) {
      this.attributeList.forEach(attr => this.existingAttributes.add(attr.attributeId));
    } else {
      this.attributeList.forEach(attr => this.existingAttributes.delete(attr.attributeId));
    }
  }

  checkIfSelected(attr: AttributeRow): boolean {
    return this.existingAttributes.has(attr.attributeId);
  }

  confirmSelection(): void {
    const selected = this.allAttributes.filter(attr => this.existingAttributes.has(attr.attributeId));
  
    this.dialogRef.close({
      data: selected,
      templateName: this.templateName,
      action: DialogCloseResponse.UPDATE
    });
  }
  

  closeDialog(): void {
    this.dialogRef.close({ action: DialogCloseResponse.NO_ACTION });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAttributeList();
  }
}