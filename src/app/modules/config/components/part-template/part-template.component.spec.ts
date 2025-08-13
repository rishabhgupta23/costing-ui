import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PartTemplateComponent } from './part-template.component';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TemplateService } from 'src/app/data/services/part-template/part-template.service';
import { SnackbarService } from 'src/app/data/services/snackbar/snackbar.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TemplateResponse } from 'src/app/data/models/part-template';
import { DialogCloseResponse } from 'src/app/shared/constants/dialog.constants';
import { mockTemplateListItems, mockTemplateResponseList } from 'src/app/mock-data/parttemplate.mock-data';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SortIcons } from 'src/app/shared/constants/table.constants';

describe('PartTemplateComponent', () => {
  let component: PartTemplateComponent;
  let fixture: ComponentFixture<PartTemplateComponent>;
  let mockTemplateService: jasmine.SpyObj<TemplateService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackbar: jasmine.SpyObj<SnackbarService>;

const mockResponse = mockTemplateResponseList;


  beforeEach(async () => {
    mockTemplateService = jasmine.createSpyObj('TemplateService', ['getTemplateList', 'createTemplate', 'getTemplateById', 'updateTemplate', 'deleteTemplate']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSnackbar = jasmine.createSpyObj('SnackbarService', ['success']);
      mockTemplateService.getTemplateList.and.returnValue(of(mockResponse));

    await TestBed.configureTestingModule({
      declarations: [PartTemplateComponent],
      imports: [BrowserAnimationsModule,MatFormFieldModule,MatIconModule,MatPaginatorModule,FormsModule, MatInputModule],
      providers: [
        { provide: TemplateService, useValue: mockTemplateService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: SnackbarService, useValue: mockSnackbar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PartTemplateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load templates on init', () => {
    mockTemplateService.getTemplateList.and.returnValue(of(mockResponse));
    fixture.detectChanges();
expect(mockTemplateService.getTemplateList).toHaveBeenCalledWith(
  component.currentPage,
  component.pageSize,
  component.filterCriteria,
  component.sortState
);

     expect(component.templateList).toEqual(mockTemplateListItems);
  expect(component.filteredTemplates).toEqual(mockTemplateListItems);
    expect(component.templateList.length).toBe(2);
  });

  it('should apply filter and fetch templates', () => {
    component.searchTermName = 'Template A';
    mockTemplateService.getTemplateList.and.returnValue(of(mockResponse));
    component.applyFilter();

expect(mockTemplateService.getTemplateList).toHaveBeenCalledWith(
  component.currentPage,
  component.pageSize,
  component.filterCriteria,
  component.sortState
);

    expect(component.filterCriteria.has('templateName')).toBeTrue();
     expect(component.filterCriteria.get('templateName')).toBe('Template A');

  expect(component.templateList).toEqual(mockTemplateListItems);
  expect(component.filteredTemplates).toEqual(mockTemplateListItems);
  expect(component.totalRecords).toBe(2);
  });

  it('should clear filter', () => {
    component.searchTermName = 'Template A';
    component.filterCriteria.set('templateName', 'Template A');
    mockTemplateService.getTemplateList.and.returnValue(of(mockResponse));

    component.clearFilter();

    expect(component.searchTermName).toBe('');
    expect(component.filterCriteria.has('templateName')).toBeFalse();
expect(mockTemplateService.getTemplateList).toHaveBeenCalledWith(
  component.currentPage,
  component.pageSize,
  component.filterCriteria,
  component.sortState
);

        expect(component.templateList).toEqual(mockTemplateListItems);
  expect(component.filteredTemplates).toEqual(mockTemplateListItems);
  expect(component.totalRecords).toBe(2);
  });

  it('should toggle sort and apply it', () => {
      expect(component.sortState.sortColumn).toBe('templateName');
  expect(component.sortState.sortState).toBe(SortIcons.ASC);
    mockTemplateService.getTemplateList.and.returnValue(of(mockResponse));
    component.toggleSort('templateName');

    expect(component.sortState.sortColumn).toBe('templateName');
      expect(component.sortState.sortState).toBe(SortIcons.DESC);
expect(mockTemplateService.getTemplateList).toHaveBeenCalledWith(
  component.currentPage,
  component.pageSize,
  component.filterCriteria,
  component.sortState
);

     expect(component.templateList).toEqual(mockTemplateListItems);
  expect(component.filteredTemplates).toEqual(mockTemplateListItems);
  expect(component.totalRecords).toBe(2);

   component.toggleSort('templateName');

  expect(component.sortState.sortState).toBe(SortIcons.ASC);
  });

 it('should toggle expand and fetch details once', () => {
  const mockDetail: TemplateResponse = {
    templateId: 1,
    templateName: 'Template A',
    partAttributes: []
  };

  mockTemplateService.getTemplateById.and.returnValue(of(mockDetail));
  component.toggleExpand(1);

  expect(component.expandedTemplateId).toBe(1);
  expect(mockTemplateService.getTemplateById).toHaveBeenCalledWith(1);
  expect(component.expandedTemplateMap.has(1)).toBeTrue();
  expect(component.expandedTemplateMap.get(1)).toEqual(mockDetail);

  component.toggleExpand(1);
  expect(component.expandedTemplateId).toBeNull();

  mockTemplateService.getTemplateById.calls.reset();
  component.toggleExpand(1);
  expect(mockTemplateService.getTemplateById).not.toHaveBeenCalled();
});


  it('should open create template dialog and create template', fakeAsync(() => {
    mockTemplateService.createTemplate.and.returnValue(of({}));
    mockTemplateService.getTemplateList.and.returnValue(of(mockResponse));

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({ action: DialogCloseResponse.UPDATE, data: [{ attributeId: 1 }] }), close: null });
    mockDialog.open.and.returnValue(dialogRefSpyObj);

    component.partTemplateName = 'New Template';
    component.openAttributeDialog();

    tick();

expect(mockTemplateService.createTemplate).toHaveBeenCalledWith({
  templateName: 'New Template',
  partAttributes: [1]
});

    expect(mockSnackbar.success).toHaveBeenCalledWith('Template created successfully!');
  }));

  it('should open edit dialog and update template', fakeAsync(() => {
    const existingTemplate: TemplateResponse = {
      templateId: 1,
      templateName: 'Template A',
      partAttributes: [{ attributeId: 1, attributeName: 'Attr 1', deleteFlag:0 }]
    };

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({ action: DialogCloseResponse.UPDATE, data: [{ attributeId: 1 }], templateName: 'Updated Template' }), close: null });
    mockDialog.open.and.returnValue(dialogRefSpyObj);

    mockTemplateService.getTemplateById.and.returnValue(of(existingTemplate));
mockTemplateService.updateTemplate.and.returnValue(of({ templateId: 1, templateName: 'Updated Template' }));
    mockTemplateService.getTemplateList.and.returnValue(of(mockResponse));

    component.editTemplate({ templateId: 1, templateName: 'Template A' });
    tick();

expect(mockTemplateService.updateTemplate).toHaveBeenCalledWith(
  1,
  {
    templateName: 'Updated Template',
    partAttributes: [1]
  }
);

    expect(mockSnackbar.success).toHaveBeenCalledWith('Template updated successfully!');
  }));

  it('should confirm and delete template', fakeAsync(() => {
    mockTemplateService.getTemplateList.and.returnValue(of(mockResponse));
    mockTemplateService.deleteTemplate.and.returnValue(of({}));

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true), close: null });
    mockDialog.open.and.returnValue(dialogRefSpyObj);

    component.deleteTemplate({ templateId: 1, templateName: 'Template A' });
    tick();

    expect(mockTemplateService.deleteTemplate).toHaveBeenCalledWith(1);
    expect(mockSnackbar.success).toHaveBeenCalledWith('Template deleted successfully!');
  }));

  it('should handle pagination', () => {
    mockTemplateService.getTemplateList.and.returnValue(of(mockResponse));
    component.onPageChange({ pageIndex: 1, pageSize: 50, length: 100 } as any);

    expect(component.currentPage).toBe(1);
    expect(component.pageSize).toBe(50);
expect(mockTemplateService.getTemplateList).toHaveBeenCalledWith(
  component.currentPage,
  component.pageSize,
  component.filterCriteria,
  component.sortState
);

  });
});
