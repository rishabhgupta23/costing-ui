import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { CategoryComponent } from './category.component';
import { CategoryService } from 'src/app/data/services/category/category.service';
import { SnackbarService } from 'src/app/data/services/snackbar/snackbar.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SortIcons, TableActions } from 'src/app/shared/constants/table.constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let mockCategoryService: any;
  let mockSnackbarService: any;
  let mockDialog: any;

  beforeEach(() => {
    mockCategoryService = {
      getCategoryList: jasmine.createSpy().and.returnValue(of({ data: [], pageInfo: { totalRecords: 0 } })),
      createCategory: jasmine.createSpy().and.returnValue(of({ categoryId: 1, name: 'New Category' })),
      updateCategory: jasmine.createSpy().and.returnValue(of({})),
      deleteCategory: jasmine.createSpy().and.returnValue(of({}))
    };

    mockSnackbarService = {
      success: jasmine.createSpy()
    };

    mockDialog = {
      open: jasmine.createSpy().and.returnValue({
        afterClosed: () => of('Edited Category')
      })
    };

    TestBed.configureTestingModule({
      declarations: [CategoryComponent],
      imports: [
      MatFormFieldModule,
      MatInputModule,
      MatDialogModule,
      MatPaginatorModule,
      BrowserAnimationsModule,
      FormsModule
      ],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: SnackbarService, useValue: mockSnackbarService },
        { provide: MatDialog, useValue: mockDialog }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch category list on init', () => {
    expect(mockCategoryService.getCategoryList).toHaveBeenCalled();
  });

  it('should create a category and reset the form', () => {
    component.categoryName = 'Test Category';
    component.submitCategoryForm();
    expect(mockCategoryService.createCategory).toHaveBeenCalledWith({ name: 'Test Category' });
  });

  it('should listen to filter changes and trigger category list fetch', fakeAsync(() => {
    component['searchSubject'].next({ key: 'name', value: 'test' });
    tick(400);
    expect(mockCategoryService.getCategoryList).toHaveBeenCalledTimes(2);
  }));

  it('should not trigger API call if filter value has not changed (distinctUntilChanged)', fakeAsync(() => {
  component.applyFilter({ key: 'name', value: 'sameValue' });
  tick(400);
  fixture.detectChanges();

  expect(mockCategoryService.getCategoryList).toHaveBeenCalledTimes(2);

  component.applyFilter({ key: 'name', value: 'sameValue' });
  tick(400);
  fixture.detectChanges();

  expect(mockCategoryService.getCategoryList).toHaveBeenCalledTimes(2);
}));


  it('should handle edit dialog and update category', () => {
    const row = { categoryId: 1, name: 'Old Name' };
    component.openEditDialog(row);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockCategoryService.updateCategory).toHaveBeenCalledWith(1, {id:1, name: 'Edited Category' });
  });

  it('should handle delete dialog and delete category', () => {
    mockDialog.open.and.returnValue({ afterClosed: () => of('DELETE') });
    const row = { categoryId: 1, name: 'ToDelete' };
    component.openDeleteDialog(row);
    expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith(1);
    expect(mockSnackbarService.success).toHaveBeenCalledWith('Category deleted successfully!');
  });

  it('should handle page change', () => {
    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 50, length: 200 };
    component.onPageChange(pageEvent);
    expect(mockCategoryService.getCategoryList).toHaveBeenCalled();
  });

  it('should apply sort and fetch category list', () => {
    const sort = { sortColumn: 'name', sortState: SortIcons.DESC };
    component.applySort(sort);
    expect(mockCategoryService.getCategoryList).toHaveBeenCalled();
  });

  it('should apply filter and fetch category list', () => {
    component.applyFilter({ key: 'name', value: 'FilterVal' });
    expect(mockCategoryService.getCategoryList).toHaveBeenCalled();
  });

  it('should handle edit action', () => {
    const row = { categoryId: 1, name: 'Row1' };
    component.handleAction({ action: TableActions.EDIT, row });
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should handle delete action', () => {
    mockDialog.open.and.returnValue({ afterClosed: () => of('DELETE') });
    const row = { categoryId: 2, name: 'Row2' };
    component.handleAction({ action: TableActions.DELETE, row });
    expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith(2);
  });
});
