import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserLandingComponent } from './user-landing.component';
import { UserService } from '../../../../data/services/user/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../../data/services/snackbar/snackbar.service';
import { of } from 'rxjs';
import { MOCK_USER_PAGINATION_RESPONSE } from '../../../../mock-data/user.mock-data';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SortIcons, TableActions } from '../../../../shared/constants/table.constants';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';

describe('UserLandingComponent', () => {
  let component: UserLandingComponent;
  let fixture: ComponentFixture<UserLandingComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;


  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUserList', 'deleteUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['success', 'error']);
    

    await TestBed.configureTestingModule({
      declarations: [UserLandingComponent],
      imports: [HttpClientTestingModule, MatPaginatorModule, BrowserAnimationsModule, TableComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: SnackbarService, useValue:snackbarServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserLandingComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user list on init', () => {
    userServiceSpy.getUserList.and.returnValue(of(MOCK_USER_PAGINATION_RESPONSE));
    component.ngOnInit();
    expect(userServiceSpy.getUserList).toHaveBeenCalled();
    expect(component.users.length).toBe(3);
    expect(component.totalRecords).toBe(3);
  });

  it('should apply filter and call getUsers with debounce', fakeAsync(() => {
    userServiceSpy.getUserList.and.returnValue(of(MOCK_USER_PAGINATION_RESPONSE));
  
    component.ngOnInit();
    fixture.detectChanges();
  
    component.applyFilter({ key: 'displayName', value: 'Yash' });
    component.applySort({ sortColumn: 'roleName', sortState: SortIcons.ASC });
    tick(300); 
    fixture.detectChanges();
  
    expect(userServiceSpy.getUserList).toHaveBeenCalledWith(
      0,
      10,
      new Map([['displayName', 'Yash']]),
      { sortColumn: 'roleName', sortState: SortIcons.ASC }
    );
  }));
  

  it('should apply sorting and refresh data', () => {
    userServiceSpy.getUserList.and.returnValue(of(MOCK_USER_PAGINATION_RESPONSE));
    component.applySort({ sortColumn: 'roleName', sortState: SortIcons.ASC });
  
    expect(component.sortState.sortColumn).toBe('roleName');
    expect(component.sortState.sortState).toBe(SortIcons.ASC);
    expect(userServiceSpy.getUserList).toHaveBeenCalledWith(
      0,
      10,
      new Map(),
      { sortColumn: 'roleName', sortState: SortIcons.ASC }
    );
  });
  

  it('should handle pagination change and fetch data', () => {
    userServiceSpy.getUserList.and.returnValue(of(MOCK_USER_PAGINATION_RESPONSE));
    component.onPageChange({ pageIndex: 1, pageSize: 5, length: 3 } as any);
    expect(component.currentPage).toBe(1);
    expect(component.pageSize).toBe(5);
    expect(userServiceSpy.getUserList).toHaveBeenCalled();
    expect(component.users.length).toBe(3);
  });

  it('should navigate to create user route', () => {
    component.createUser();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/app/users/create');
  });

  it('should navigate to edit user route when EDIT action is triggered', () => {
    const user =MOCK_USER_PAGINATION_RESPONSE.data[0];
    component.handleAction({ action: TableActions.EDIT, row: user });
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(`/app/users/edit/${user.userId}`);
  });

  it('should open dialog and delete user on confirm', () => {
    const user = MOCK_USER_PAGINATION_RESPONSE.data[0];
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(DialogCloseResponse.DELETE));
  
    const dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    dialogSpy.open.and.returnValue(dialogRefSpy);
  
    userServiceSpy.deleteUser.and.returnValue(of(void 0));
    userServiceSpy.getUserList.and.returnValue(of(MOCK_USER_PAGINATION_RESPONSE));
  
    component.handleAction({ action: TableActions.DELETE, row: user });
  
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith(user.userId!);
    expect(snackbarServiceSpy.success).toHaveBeenCalledWith('User deleted successfully');
  });

  it('should not delete user if dialog is closed without confirmation', () => {
    const user = MOCK_USER_PAGINATION_RESPONSE.data[0];
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(null));
  
    const dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    dialogSpy.open.and.returnValue(dialogRefSpy);
  
    component.handleAction({ action: TableActions.DELETE, row: user });
  
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(userServiceSpy.deleteUser).not.toHaveBeenCalled();
  });
  
  
  it('should update filterCriteria on applyFilter', () => {
    const filter = { key: 'roleName', value: 'Admin' };
    component.applyFilter(filter);
    expect(component.filterCriteria.get('roleName')).toBe('Admin');
  });
  
  

});
