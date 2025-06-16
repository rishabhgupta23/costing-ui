import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TemplateDialogComponent } from './template-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PartAttributeService } from 'src/app/data/services/part-attribute/part-attribute.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogCloseResponse } from 'src/app/shared/constants/dialog.constants';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatTableModule } from '@angular/material/table';

describe('TemplateDialogComponent', () => {
  let component: TemplateDialogComponent;
  let fixture: ComponentFixture<TemplateDialogComponent>;
  let mockPartAttributeService: jasmine.SpyObj<PartAttributeService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<TemplateDialogComponent>>;

  const mockAttributeList = [
    { attributeId: 1, attributeName: 'Color' },
    { attributeId: 2, attributeName: 'Size' },
    { attributeId: 3, attributeName: 'Material' }
  ];

  beforeEach(async () => {
 mockPartAttributeService = jasmine.createSpyObj('PartAttributeService', ['getPartAttributeList']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

      mockPartAttributeService.getPartAttributeList.and.returnValue(
    of({ content: mockAttributeList, totalElements: 3 })
  );
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        NoopAnimationsModule,
        MatTableModule
      ],
      declarations: [TemplateDialogComponent],
      providers: [
        { provide: PartAttributeService, useValue: mockPartAttributeService },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            templateName: 'My Template',
            buttonLabel: 'Create Template',
            existingAttributes: new Set<number>([2]),
            isEditMode: true
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with injected data', () => {
    expect(component.templateName).toBe('My Template');
    expect(component.isEditMode).toBeTrue();
    expect(component.buttonLabel).toBe('Create Template');
    expect(component.existingAttributes.has(2)).toBeTrue();
  });

  it('should fetch attribute list', () => {
    mockPartAttributeService.getPartAttributeList.and.returnValue(of({ data: mockAttributeList, pageInfo: { totalRecords: 3 } }));
    component.getAttributeList();
expect(mockPartAttributeService.getPartAttributeList).toHaveBeenCalledWith(
  component.currentPage,
  component.pageSize,
  component.filterCriteria,
  component.sortState
);

    expect(component.attributeList.length).toBe(3);
    expect(component.totalRecords).toBe(3);
  });

  it('should apply filter and call getAttributeList', fakeAsync(() => {
      spyOn(component, 'getAttributeList').and.callThrough();
    component.searchTerm = 'Color';
    component.applyFilter();
    tick(300);
    expect(component.getAttributeList).toHaveBeenCalled();
     const mostRecentCall = mockPartAttributeService.getPartAttributeList.calls.mostRecent();
  expect(mostRecentCall).toBeDefined();
  const filterArg = mostRecentCall.args[2];
  expect(filterArg instanceof Map).toBeTrue();
  expect(filterArg?.get('attributeName')).toBe('Color');
  }));

  it('should toggle sort order', () => {
    const initialState = component.sortState.sortState;
    component.toggleSort('attributeName');
    expect(component.sortState.sortColumn).toBe('attributeName');
    expect(component.sortState.sortState).not.toBe(initialState);
  });

  it('should select and deselect attributes', () => {
    const attr = { attributeId: 5, attributeName: 'Weight' };
    component.toggleAttributeSelection(attr, { checked: true });
    expect(component.existingAttributes.has(5)).toBeTrue();

    component.toggleAttributeSelection(attr, { checked: false });
    expect(component.existingAttributes.has(5)).toBeFalse();
  });

  it('should check all and deselect all attributes', () => {
    component.attributeList = mockAttributeList;
    component.selectAll({ checked: true });
    mockAttributeList.forEach(attr => {
      expect(component.existingAttributes.has(attr.attributeId)).toBeTrue();
    });

    component.selectAll({ checked: false });
    mockAttributeList.forEach(attr => {
      expect(component.existingAttributes.has(attr.attributeId)).toBeFalse();
    });
  });

  it('should handle page change', () => {
    mockPartAttributeService.getPartAttributeList.and.returnValue(of({ data: [], pageInfo: { totalRecords: 0 } }));
    component.onPageChange({ pageIndex: 2, pageSize: 50, length: 100 });
    expect(component.currentPage).toBe(2);
    expect(component.pageSize).toBe(50);
  });

  it('should close dialog with selected attributes on confirm', () => {
    component.allAttributes = mockAttributeList;
    mockAttributeList.forEach(attr => component.existingAttributes.add(attr.attributeId));
    component.confirmSelection();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      data: mockAttributeList,
      templateName: component.templateName,
      action: DialogCloseResponse.UPDATE
    });
  });

  
  it('should close dialog with NO_ACTION on cancel', () => {
    component.closeDialog();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ action: DialogCloseResponse.NO_ACTION });
  });
});
