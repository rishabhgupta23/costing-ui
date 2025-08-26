import { Component, inject } from '@angular/core';
import { PART_ATTRIBUTE_TABLE_COLUMNS } from 'src/app/data/constants/config-table.constant';
import { PageEvent } from '@angular/material/paginator';
import { PartAttribute, SortState } from 'src/app/data/models/part';
import { SortIcons, TableActions } from 'src/app/shared/constants/table.constants';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { DialogCloseResponse } from 'src/app/shared/constants/dialog.constants';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/data/services/snackbar/snackbar.service';
import { ConfirmDialogComponent, ConfirmDialogData } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from 'src/app/shared/components/edit-dialog/edit-dialog.component';
import { PartAttributeService } from 'src/app/data/services/part-attribute/part-attribute.service';

@Component({
  selector: 'app-part-attribute',
  templateUrl: './part-attribute.component.html',
  styleUrl: './part-attribute.component.scss'
})
export class PartAttributeComponent {
  columns = PART_ATTRIBUTE_TABLE_COLUMNS;
  dataSource: PartAttribute[] = [];
  attributeName: string = '';
  pageSize: number = 100;
  currentPage: number = 0;
  totalRecords: number = 0;
  filterCriteria: Map<string, string> = new Map();
  sortState: SortState = { sortColumn: 'attributeName', sortState: SortIcons.ASC };
  private searchSubject = new Subject<{ key: string; value: string }>();

  constructor(
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private partAttributeService: PartAttributeService
  ) {
    this.listenToFilterChanges();
    this.getPartAttributeList();
  }

  listenToFilterChanges() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => prev.value === curr.value),
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.getPartAttributeList();
      });
  }

  getPartAttributeList() {
    this.partAttributeService.getPartAttributeList(
      this.currentPage,
      this.pageSize,
      this.filterCriteria,
      this.sortState
    ).subscribe({
      next: (res) => {
        this.dataSource = res.data;
        this.totalRecords = res.pageInfo?.totalRecords || 0;
      }
    });
  }

  applySort(sort: SortState) {
    this.sortState = sort;
    this.getPartAttributeList();
  }

  applyFilter(filter: { key: string; value: string }) {
    this.filterCriteria.set(filter.key, filter.value);
    this.searchSubject.next(filter);
  }

  submitAttributeForm() {
    if (this.attributeName) {
      this.partAttributeService.createPartAttribute(this.attributeName).subscribe({
        next: () => {
          this.attributeName = '';
          this.getPartAttributeList();
          this.snackbarService.success('Part attribute created successfully!');
        }
      });
    }
  }
  

  openEditDialog(row: any) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '30rem',
      height: '16rem',
      data: { 
        labelName: 'Part Attribute Name',
        dialogTitle: 'Edit Part Attribute',
        name: row.attributeName,
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const updatedAttribute = {
      attributeId: row.attributeId,
      attributeName: res
    };
        this.partAttributeService.updatePartAttribute(row.attributeId, updatedAttribute).subscribe({
          next: () => {
            this.snackbarService.success('Attribute updated successfully!');
            this.getPartAttributeList();
          }
        });
      }
    });
  }

  openDeleteDialog(row: any) {
    const dialogData: ConfirmDialogData = {
      title: 'Delete Attribute',
      message: 'Attribute of the parts will be set to empty. <br><br> Are you sure you want to delete this Attribute?'
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: dialogData 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === DialogCloseResponse.POSITIVE) {
        this.partAttributeService.deletePartAttribute(row.attributeId).subscribe({
          next: () => {
            this.snackbarService.success('Attribute deleted successfully!');
            this.getPartAttributeList();
          }
        });
      }
    });
  }

  handleAction(event: { action: TableActions; row: any }) {
    const { action, row } = event;
    if (action === TableActions.EDIT) {
      this.openEditDialog(row);
    } else if (action === TableActions.DELETE) {
      this.openDeleteDialog(row);
    }
  }

  onPageChange(event: PageEvent){
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPartAttributeList();
  }
}
