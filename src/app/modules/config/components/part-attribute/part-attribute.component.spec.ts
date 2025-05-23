import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PartAttributeComponent } from './part-attribute.component';
import { PartAttributeService } from 'src/app/data/services/part-attribute/part-attribute.service';
import { SnackbarService } from 'src/app/data/services/snackbar/snackbar.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SortIcons, TableActions } from 'src/app/shared/constants/table.constants';

fdescribe('PartAttributeComponent', () => {
  let component: PartAttributeComponent;
  let fixture: ComponentFixture<PartAttributeComponent>;
  let mockService: any;
  let mockSnackbar: any;
  let mockDialog: any;

  beforeEach(() => {
    mockService = {
      getPartAttributeList: jasmine.createSpy().and.returnValue(of({ data: [], pageInfo: { totalRecords: 0 } })),
      createPartAttribute: jasmine.createSpy().and.returnValue(of({ name: 'Test Attribute' })),
      updatePartAttribute: jasmine.createSpy().and.returnValue(of({})),
      deletePartAttribute: jasmine.createSpy().and.returnValue(of({}))
    };

    mockSnackbar = {
      success: jasmine.createSpy()
    };

    mockDialog = {
      open: jasmine.createSpy().and.returnValue({
        afterClosed: () => of('Updated Name')
      })
    };

    TestBed.configureTestingModule({
      declarations: [PartAttributeComponent],
      imports: [
        MatDialogModule,
        MatPaginatorModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: PartAttributeService, useValue: mockService },
        { provide: SnackbarService, useValue: mockSnackbar },
        { provide: MatDialog, useValue: mockDialog }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PartAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPartAttributeList on init', () => {
    expect(mockService.getPartAttributeList).toHaveBeenCalled();
  });

  it('should create attribute and reset input', () => {
    component.attributeName = 'New Attribute';
    component.submitAttributeForm();
    expect(mockService.createPartAttribute).toHaveBeenCalledWith('New Attribute');
    expect(mockSnackbar.success).toHaveBeenCalledWith('Part attribute created successfully!');
  });

  it('should handle edit dialog and update attribute', () => {
    const row = { attributeId: 1, attributeName: 'Old Name' };
    component.openEditDialog(row);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockService.updatePartAttribute).toHaveBeenCalledWith(1, {attributeId: 1, attributeName: 'Updated Name' });
    expect(mockSnackbar.success).toHaveBeenCalledWith('Attribute updated successfully!');
  });

  it('should handle delete dialog and delete attribute', () => {
    mockDialog.open.and.returnValue({ afterClosed: () => of('DELETE') });
    const row = { attributeId: 1, name: 'ToDelete' };
    component.openDeleteDialog(row);
    expect(mockService.deletePartAttribute).toHaveBeenCalledWith(1);
    expect(mockSnackbar.success).toHaveBeenCalledWith('Attribute deleted successfully!');
  });

  it('should handle page change and fetch data', () => {
    const pageEvent: PageEvent = { pageIndex: 2, pageSize: 50, length: 100 };
    component.onPageChange(pageEvent);
    expect(mockService.getPartAttributeList).toHaveBeenCalled();
  });

  it('should apply sorting and fetch list', () => {
    const sort = { sortColumn: 'name', sortState: SortIcons.DESC };
    component.applySort(sort);
    expect(component.sortState).toEqual(sort);
    expect(mockService.getPartAttributeList).toHaveBeenCalled();
  });

  it('should apply filter and fetch list', () => {
    component.applyFilter({ key: 'name', value: 'filterVal' });
    expect(mockService.getPartAttributeList).toHaveBeenCalled();
  });

  it('should handle EDIT action', () => {
    const row = { attributeId: 1, name: 'Test' };
    component.handleAction({ action: TableActions.EDIT, row });
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should handle DELETE action', () => {
    mockDialog.open.and.returnValue({ afterClosed: () => of('DELETE') });
    const row = { attributeId: 2, name: 'Test2' };
    component.handleAction({ action: TableActions.DELETE, row });
    expect(mockService.deletePartAttribute).toHaveBeenCalledWith(2);
  });

  it('should listen to filter changes and debounce', fakeAsync(() => {
    component['searchSubject'].next({ key: 'name', value: 'abc' });
    tick(400);
    expect(mockService.getPartAttributeList).toHaveBeenCalledTimes(2); // one from init, one from debounce
  }));

  it('should not trigger API if filter value is same', fakeAsync(() => {
    component.applyFilter({ key: 'name', value: 'same' });
    tick(400);
    expect(mockService.getPartAttributeList).toHaveBeenCalledTimes(2);
    component.applyFilter({ key: 'name', value: 'same' });
    tick(400);
    expect(mockService.getPartAttributeList).toHaveBeenCalledTimes(2);
  }));
});
