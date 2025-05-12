import { Component, inject } from '@angular/core';
import { CATEGORY_TABLE_COLUMNS } from 'src/app/data/constants/config-columns.constant';
import { CategoryService } from 'src/app/data/services/category/category.service';
import { PageEvent } from '@angular/material/paginator';
import { SortState } from 'src/app/data/models/part'; // Import SortState if you need sorting
import { SortIcons, TableActions } from 'src/app/shared/constants/table.constants';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { DialogCloseResponse } from 'src/app/shared/constants/dialog.constants';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/data/services/snackbar/snackbar.service';
import { ConfirmDialogComponent, ConfirmDialogData } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from 'src/app/shared/components/edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  columns = CATEGORY_TABLE_COLUMNS;
  dataSource: any[] = [];
  categoryName: string = '';
  pageSize: number = 100;
  currentPage: number = 0;
  totalRecords: number = 0;
  filterCriteria: Map<string, string> = new Map();
  sortState: SortState = { sortColumn: 'name', sortState: SortIcons.ASC };
  private searchSubject = new Subject<{ key: string; value: string }>(); 

  constructor(private categoryService: CategoryService, private snackbarService: SnackbarService, private dialog: MatDialog) {
    this.getCategoryList();
    this.listenToFilterChanges();
  }

  getCategoryList(): void {
    this.categoryService.getCategoryList(this.currentPage, this.pageSize, this.filterCriteria, this.sortState
    ).subscribe({
      next: (res) => {
        this.dataSource = res.data;
        this.totalRecords = res.pageInfo?.totalRecords || 0;
      }
    });
  }

  submitCategoryForm(): void {
    if (this.categoryName) {
      const payload = { name: this.categoryName };
      this.categoryService.createCategory(payload).subscribe({
        next: () => {
          this.categoryName = '';
          this.getCategoryList();
        }
      });
    }
  }

  listenToFilterChanges(): void {
    this.searchSubject
      .pipe(
        debounceTime(300), 
        distinctUntilChanged((prev, curr) => prev.value === curr.value), // Ignore duplicate searches
      )
      .subscribe(
        (res) => {
          this.currentPage = 0;
          this.getCategoryList();
        }
      );
  }

  openEditDialog(row: any): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '30rem',
      height: '16rem',
      data: { name: row.name }
    });
  
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const updatedCategory = { id: row.categoryId, name: res };
        this.categoryService.updateCategory(row.categoryId, updatedCategory).subscribe(() => {
          row.name = res;
        });
      }
    });
  }
  
  

  openDeleteDialog(row:any){
    const dialogData: ConfirmDialogData = {
      title: 'Delete Category',
      message: 'Category of the parts will be set to empty. <br><br> Are you sure you want to delete this Category?'
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { 
      data: dialogData 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === DialogCloseResponse.DELETE) {
        this.categoryService.deleteCategory(row.categoryId).subscribe({
          next: () => {
            this.snackbarService.success('Category deleted successfully!');
            this.getCategoryList(); 
             },
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

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getCategoryList();
  }

  applySort(sort: SortState): void {
    this.sortState = sort;
    this.getCategoryList();
  }

  applyFilter(filter: { key: string; value: string }): void {
    this.filterCriteria.set(filter.key, filter.value);
    this.searchSubject.next(filter);
  }
}
