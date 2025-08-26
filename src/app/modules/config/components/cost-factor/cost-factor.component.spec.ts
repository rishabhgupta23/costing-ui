import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CostFactorComponent } from './cost-factor.component';
import { CostFactorService } from 'src/app/data/services/cost-factor/cost-factor.service';
import { SnackbarService } from 'src/app/data/services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DialogCloseResponse } from 'src/app/shared/constants/dialog.constants';
import { SortIcons, TableActions } from 'src/app/shared/constants/table.constants';
import { FormsModule } from '@angular/forms';

class MockSnackbarService {
  success(message: string) {}
  error(message: string) {}
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of('mock result')
    };
  }
}

describe('CostFactorComponent', () => {
  let component: CostFactorComponent;
  let fixture: ComponentFixture<CostFactorComponent>;
  let mockCostFactorService: any;
  let snackbarService: SnackbarService;
  let dialog: MatDialog;

  beforeEach(async () => {
    mockCostFactorService = {
      getCostFactorList: jasmine.createSpy().and.returnValue(of({
        data: [
          { id: 1, factorName: 'Factor 1' },
          { id: 2, factorName: 'Factor 2' }
        ],
        pageInfo: { totalRecords: 2 }
      })),
      createCostFactor: jasmine.createSpy().and.returnValue(of({ id: 3, factorName: 'New Factor' })),
      updateCostFactor: jasmine.createSpy().and.returnValue(of({})),
      deleteCostFactor: jasmine.createSpy().and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [CostFactorComponent],
      imports: [MatPaginatorModule, FormsModule],
      providers: [
        { provide: CostFactorService, useValue: mockCostFactorService },
        { provide: SnackbarService, useClass: MockSnackbarService },
        { provide: MatDialog, useClass: MockMatDialog }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CostFactorComponent);
    component = fixture.componentInstance;
    snackbarService = TestBed.inject(SnackbarService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch cost factors on initialization', () => {
    expect(mockCostFactorService.getCostFactorList).toHaveBeenCalled();
    expect(component.dataSource).toEqual([
    { id: 1, factorName: 'Factor 1' },
    { id: 2, factorName: 'Factor 2' }
    ]);
  });

  it('should create a cost factor', () => {
    spyOn(snackbarService, 'success');
    component.factorName = 'New Factor';
    component.submitCostFactorForm();
    expect(mockCostFactorService.createCostFactor).toHaveBeenCalledWith('New Factor');
    expect(snackbarService.success).toHaveBeenCalledWith('Cost Factor created successfully!');
  });

  it('should open edit dialog and update factor', () => {
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpyObj.afterClosed.and.returnValue(of('Updated Factor'));
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    spyOn(snackbarService, 'success');

    const row = { id: 1, factorName: 'Old Factor' };
    component.openEditDialog(row);

    expect(dialog.open).toHaveBeenCalled();
    expect(mockCostFactorService.updateCostFactor).toHaveBeenCalledWith(1, 'Updated Factor');
    expect(snackbarService.success).toHaveBeenCalledWith('Cost Factor updated successfully!');
  });

  it('should open delete dialog and delete factor', () => {
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpyObj.afterClosed.and.returnValue(of(DialogCloseResponse.POSITIVE));
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    spyOn(snackbarService, 'success');

    const row = { id: 1 };
    component.openDeleteDialog(row);

    expect(dialog.open).toHaveBeenCalled();
    expect(mockCostFactorService.deleteCostFactor).toHaveBeenCalledWith(1);
    expect(snackbarService.success).toHaveBeenCalledWith('Cost Factor deleted successfully!');
  });

  it('should handle filter changes', () => {
    spyOn(component, 'getCostFactorList').and.callThrough();
    component.applyFilter({ key: 'factorName', value: 'Test' });
    expect(component.getCostFactorList).toHaveBeenCalled();
    expect(mockCostFactorService.getCostFactorList).toHaveBeenCalledWith(
      0,
      100,
      new Map([['factorName', 'Test']]),
      { sortColumn: 'factorName', sortState: SortIcons.ASC }
    );
  });

  it('should handle sorting', () => {
    spyOn(component, 'getCostFactorList').and.callThrough();
    component.applySort({ sortColumn: 'factorName', sortState: SortIcons.ASC });
    expect(component.getCostFactorList).toHaveBeenCalled();
    expect(mockCostFactorService.getCostFactorList).toHaveBeenCalledWith(
      0,
      100,
      component.filterCriteria,
      { sortColumn: 'factorName', sortState: SortIcons.ASC }
    );
  });

  it('should handle pagination', () => {
    spyOn(component, 'getCostFactorList').and.callThrough();
    component.onPageChange({ pageIndex: 1, pageSize: 50, length: 100 } as any);
    expect(component.getCostFactorList).toHaveBeenCalled();
    expect(mockCostFactorService.getCostFactorList).toHaveBeenCalledWith(
      1,
      50,
      component.filterCriteria,
      component.sortState
    );
  });

  it('should call openEditDialog on EDIT action', () => {
    spyOn(component, 'openEditDialog');
    const row = { id: 1, factorName: 'Test' };
    component.handleAction({ action: TableActions.EDIT, row });
    expect(component.openEditDialog).toHaveBeenCalledWith(row);
  });

  it('should call openDeleteDialog on DELETE action', () => {
    spyOn(component, 'openDeleteDialog');
    const row = { id: 2, factorName: 'Row2' };
    component.handleAction({ action: TableActions.DELETE, row });
    expect(component.openDeleteDialog).toHaveBeenCalledWith(row);
  });

  it('should listen to filter changes and fetch list', fakeAsync(() => {
    spyOn(component, 'getCostFactorList');
    component['searchSubject'].next({ key: 'factorName', value: 'test' });
    tick(400);
    expect(component.getCostFactorList).toHaveBeenCalled();
  }));

  it('should not fetch list if filter value has not changed', fakeAsync(() => {
    spyOn(component, 'getCostFactorList');
    component['searchSubject'].next({ key: 'factorName', value: 'same' });
    tick(400);
    component['searchSubject'].next({ key: 'factorName', value: 'same' });
    tick(400);
    expect(component.getCostFactorList).toHaveBeenCalledTimes(1);
  }));
});
