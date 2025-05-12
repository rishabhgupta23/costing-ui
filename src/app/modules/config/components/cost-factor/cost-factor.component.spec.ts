import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CostFactorComponent } from './cost-factor.component';
import { CostFactorService } from 'src/app/data/services/cost-factor/cost-factor.service';
import { SnackbarService } from 'src/app/data/services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { COSTFACTOR_TABLE_COLUMNS } from 'src/app/data/constants/list-items.constant';
import { DialogCloseResponse } from 'src/app/shared/constants/dialog.constants';
import { SortIcons } from 'src/app/shared/constants/table.constants';

class MockCostFactorService {
  getCostFactorList() {
    return of({
      data: [
        { id: 1, name: 'Factor 1' },
        { id: 2, name: 'Factor 2' }
      ],
      pageInfo: { totalRecords: 2 }
    });
  }

  createCostFactor() {
    return of(null);
  }

  updateCostFactor() {
    return of(null);
  }

  deleteCostFactor() {
    return of(null);
  }
}

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

fdescribe('CostFactorComponent', () => {
  let component: CostFactorComponent;
  let fixture: ComponentFixture<CostFactorComponent>;
  let costFactorService: CostFactorService;
  let snackbarService: SnackbarService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CostFactorComponent],
      imports: [MatPaginatorModule],
      providers: [
        { provide: CostFactorService, useClass: MockCostFactorService },
        { provide: SnackbarService, useClass: MockSnackbarService },
        { provide: MatDialog, useClass: MockMatDialog }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CostFactorComponent);
    component = fixture.componentInstance;
    costFactorService = TestBed.inject(CostFactorService);
    snackbarService = TestBed.inject(SnackbarService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch cost factors on initialization', () => {
    spyOn(costFactorService, 'getCostFactorList').and.callThrough();
    component.getCostFactorList();
    expect(costFactorService.getCostFactorList).toHaveBeenCalled();
    expect(component.dataSource.length).toBe(2);
  });

  it('should create a cost factor', () => {
    spyOn(costFactorService, 'createCostFactor').and.callThrough();
    spyOn(snackbarService, 'success');
    component.factorName = 'New Factor';
    component.submitCostFactorForm();
    expect(costFactorService.createCostFactor).toHaveBeenCalledWith('New Factor');
    expect(snackbarService.success).toHaveBeenCalledWith('Cost Factor created successfully!');
  });

  it('should open edit dialog and update factor', () => {
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpyObj.afterClosed.and.returnValue(of('Updated Factor'));
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    spyOn(costFactorService, 'updateCostFactor').and.callThrough();
    spyOn(snackbarService, 'success');

    const row = { id: 1, factorName: 'Old Factor' };
    component.openEditDialog(row);

    expect(dialog.open).toHaveBeenCalled();
    expect(costFactorService.updateCostFactor).toHaveBeenCalledWith(1, { factorName: 'Updated Factor' });
    expect(snackbarService.success).toHaveBeenCalledWith('Cost Factor updated successfully!');
  });

  it('should open delete dialog and delete factor', () => {
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpyObj.afterClosed.and.returnValue(of(DialogCloseResponse.DELETE));
    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    spyOn(costFactorService, 'deleteCostFactor').and.callThrough();
    spyOn(snackbarService, 'success');

    const row = { id: 1 };
    component.openDeleteDialog(row);

    expect(dialog.open).toHaveBeenCalled();
    expect(costFactorService.deleteCostFactor).toHaveBeenCalledWith('1');
    expect(snackbarService.success).toHaveBeenCalledWith('Cost Factor deleted successfully!');
  });

  it('should handle filter changes', () => {
    spyOn(component, 'getCostFactorList');
    component.applyFilter({ key: 'factorName', value: 'Test' });
    expect(component.getCostFactorList).toHaveBeenCalled();
  });

  it('should handle sorting', () => {
    spyOn(component, 'getCostFactorList');
    component.applySort({ sortColumn: 'factorName', sortState: SortIcons.ASC });
    expect(component.getCostFactorList).toHaveBeenCalled();
  });

  it('should handle pagination', () => {
    spyOn(component, 'getCostFactorList');
    component.onPageChange({ pageIndex: 1, pageSize: 50, length: 100 } as any);
    expect(component.getCostFactorList).toHaveBeenCalled();
  });
});
