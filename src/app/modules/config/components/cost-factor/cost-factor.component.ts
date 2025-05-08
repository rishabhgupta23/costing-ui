import { Component, inject } from '@angular/core';
import { CostFactorService } from 'src/app/data/services/cost-factor/cost-factor.service';
import { SnackbarService } from 'src/app/data/services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { SortIcons, TableActions } from 'src/app/shared/constants/table.constants';
import { ConfirmDialogComponent, ConfirmDialogData } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from 'src/app/shared/components/edit-dialog/edit-dialog.component';
import { SortState } from 'src/app/data/models/part';
import { PageEvent } from '@angular/material/paginator';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { DialogCloseResponse } from 'src/app/shared/constants/dialog.constants';
import { COSTFACTOR_TABLE_COLUMNS } from 'src/app/data/constants/list-items.constant';

@Component({
  selector: 'app-cost-factor',
  templateUrl: './cost-factor.component.html',
  styleUrls: ['./cost-factor.component.scss']
})
export class CostFactorComponent {
  columns = COSTFACTOR_TABLE_COLUMNS;
  dataSource: any[] = [];
  factorName: string = '';
  pageSize = 100;
  currentPage = 0;
  totalRecords = 0;

  filterCriteria: Map<string, string> = new Map();
  sortState: SortState = { sortColumn: 'factorName', sortState: SortIcons.ASC };
  private searchSubject = new Subject<{ key: string; value: string }>();

  private dialog = inject(MatDialog);

  constructor(
    private costFactorService: CostFactorService,
    private snackbarService: SnackbarService
  ) {
    this.listenToFilterChanges();
    this.getCostFactorList();
  }

  getCostFactorList(): void {
    this.costFactorService.getCostFactorList(
      this.currentPage,
      this.pageSize,
      this.filterCriteria,
      this.sortState
    ).subscribe({
      next: (res) => {
        this.dataSource = res.data.map((item: any) => ({
          ...item,
          factorName: item.name
        }));

        this.totalRecords = res.pageInfo?.totalRecords || 0;
      }
    });
  }

  submitCostFactorForm(): void {
    if (this.factorName) {
      this.costFactorService.createCostFactor(this.factorName).subscribe({
        next: () => {
          this.snackbarService.success('Cost Factor created successfully!');
          this.factorName = '';
          this.getCostFactorList();
        },
        error: () => {
          this.snackbarService.error('Failed to create Cost Factor. Please try again.');
        }
      });
    }
  }
  
  

  listenToFilterChanges(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => prev.value === curr.value)
    ).subscribe(() => {
      this.currentPage = 0;
      this.getCostFactorList();
    });
  }

  openEditDialog(row: any): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '30rem',
      height: '16rem',
      data: {
        labelName: 'Cost Factor Name',
        dialogTitle: 'Edit Cost Factor',
        name: row.factorName
      }
    });
  
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.costFactorService.updateCostFactor(row.id, res).subscribe(() => {
          this.snackbarService.success('Cost Factor updated successfully!');
          this.getCostFactorList();
          row.factorName = res;
        });
      }
    });
  }

  openDeleteDialog(row: any): void {
    const dialogData: ConfirmDialogData = {
      title: 'Delete Cost Factor',
      message: 'Are you sure you want to delete this Cost Factor?'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === DialogCloseResponse.DELETE) {
        this.costFactorService.deleteCostFactor(row.id).subscribe({
          next: () => {
            this.snackbarService.success('Cost Factor deleted successfully!');
            this.getCostFactorList();
          },
          error: () => {
            this.snackbarService.error('Failed to delete Cost Factor. Please try again.');
          }
        });
      }
    });
  }

  handleAction(event: { action: TableActions; row: any }): void {
    const { action, row } = event;
    if (action === TableActions.EDIT) {
      this.openEditDialog(row);
    } else if (action === TableActions.DELETE) {
      this.openDeleteDialog(row);
    }
  }

  applyFilter(filter: { key: string; value: string }): void {
    this.filterCriteria.set(filter.key, filter.value);
    this.currentPage = 0;
    this.getCostFactorList();
  }

  applySort(sort: SortState): void {
    this.sortState = sort;
    this.getCostFactorList();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getCostFactorList();
  }
}
