import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../data/services/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../../data/models/user';
import { USER_TABLE_COLUMNS } from '../../../../data/constants/user-table-config.constants';
import { PageEvent } from '@angular/material/paginator';
import { SortIcons, TableActions } from '../../../../shared/constants/table.constants';
import { SortState } from '../../../../data/models/part';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SnackbarService } from '../../../../data/services/snackbar/snackbar.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { getValueOrNull } from '../../../../shared/utils/string.util';

@Component({
  selector: 'app-user-landing',
  templateUrl: './user-landing.component.html',
  styleUrls: ['./user-landing.component.scss']
})
export class UserLandingComponent implements OnInit {
  users: User[] = [];
  columns = USER_TABLE_COLUMNS;
  totalRecords: number = 0;
  pageSize: number = 10; // Default items per page
  currentPage: number = 0;
  filterCriteria: Map<string, string> = new Map();
  sortState: SortState = { sortColumn: 'displayName', sortState: SortIcons.ASC };
  private searchSubject = new Subject<{ key: string; value: string }>();

  constructor(
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.listenToFilterChanges();
  }

  getUsers(): void {
    this.userService
      .getUserList(this.currentPage, this.pageSize, this.filterCriteria, this.sortState)
      .subscribe({
        next: (res) => {
          this.users = getValueOrNull(res?.data);
          this.totalRecords = getValueOrNull(res?.pageInfo?.totalRecords);
        }
      });
  }
  
  
  

  listenToFilterChanges(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => prev.value === curr.value)
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.getUsers();
      });
  }

  createUser() {
    this.router.navigateByUrl("/app/users/create");
  }

  applyFilter(filter: { key: string; value: string }): void {
    this.filterCriteria.set(filter.key, filter.value);
    this.searchSubject.next(filter);
  }

  applySort(sort: SortState): void {
    this.sortState = sort;
    this.getUsers();
  }
  handleAction(event: { action: TableActions; row: User }): void {
    const { action, row } = event;
  
    if (action === TableActions.DELETE) {
      const dialogData: ConfirmDialogData = {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user?'
      };
  
      const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: dialogData });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result === DialogCloseResponse.POSITIVE) {
          this.deleteUser(row.userId!);
        }
      });
    }
    else if (action === TableActions.EDIT) {
      this.router.navigateByUrl(`/app/users/edit/${row.userId}`);
  }
}
  
  deleteUser(userId: number): void {
    
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.getUsers();
        this.snackbarService.success('User deleted successfully');
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getUsers();
  }
}
