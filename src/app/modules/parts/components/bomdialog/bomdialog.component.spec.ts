import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MOCK_PART_LIST_RESPONSE, MOCK_PART_ROW_LIST } from "../../../../mock-data/part.mock-data";
import { SortIcons } from "../../../../shared/constants/table.constants";
import { DialogCloseResponse } from "../../../../shared/constants/dialog.constants";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { BomdialogComponent } from "./bomdialog.component";
import { of } from "rxjs";
import { PartService } from "../../../../data/services/part/part.service";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";

describe('BomdialogComponent', () => {
  let component: BomdialogComponent;
  let fixture: ComponentFixture<BomdialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<BomdialogComponent>>;
  let mockPartService: jasmine.SpyObj<PartService>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockPartService = jasmine.createSpyObj('PartService', ['getPartList']);

    await TestBed.configureTestingModule({
      declarations: [BomdialogComponent],
      imports: [
        FormsModule, MatCheckboxModule, MatPaginatorModule,
        BrowserAnimationsModule, MatDialogModule, MatTableModule, MatIconModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { existingParts: new Set([1]) } },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: PartService, useValue: mockPartService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BomdialogComponent);
    component = fixture.componentInstance;

    mockPartService.getPartList.and.returnValue(of(MOCK_PART_LIST_RESPONSE));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and fetch parts list on ngOnInit', () => {
    expect(component.partList.length).toBe(2);
    expect(mockPartService.getPartList).toHaveBeenCalledWith(
      component.currentPage,
      component.pageSize,
      new Map(),
      component.sortColumn,
      component.sortState
    );
  });

  it('should toggle part selection', () => {
    const part = { partId: 2 } as any;
    const event = { checked: true };
    component.togglePartSelection(part, event);
    expect(component.existingParts.has(2)).toBeTrue();

    component.togglePartSelection(part, { checked: false });
    expect(component.existingParts.has(2)).toBeFalse();
  });

  it('should select and deselect all parts', () => {
    component.selectAll({ checked: true });
    expect(component.existingParts.size).toBeGreaterThan(0);

    component.selectAll({ checked: false });
    expect(component.existingParts.size).toBe(0);
  });

  it('should apply filter and trigger getPartList with debounce', fakeAsync(() => {
    component.searchTermName = 'test';
    component.applyFilter();
    tick(300);
    expect(mockPartService.getPartList).toHaveBeenCalledWith(
      component.currentPage,
      component.pageSize,
      new Map([['partName', 'test']]),
      'partNumber',
      component.sortState
    );
  }));

  it('should confirm selection and close dialog with selected parts', () => {
    component.allParts = MOCK_PART_ROW_LIST;
    component.confirmSelection();
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      data: jasmine.any(Array),
      action: DialogCloseResponse.UPDATE
    });
  });

  it('should apply sorting when toggleSort is called', () => {
    spyOn(component, 'getPartList');
    component.toggleSort('partName');
    expect(component.sortState.sortColumn).toBe('partName');
    expect(component.getPartList).toHaveBeenCalled();
});

  it('should update pagination values and fetch part list on page change', () => {
    const event: PageEvent = { pageIndex: 1, pageSize: 50, length: 2 };
    component.onPageChange(event);
    expect(component.currentPage).toBe(1);
    expect(component.pageSize).toBe(50);
    expect(mockPartService.getPartList).toHaveBeenCalledWith(
      1,
      50,
      new Map(),
      component.sortColumn,
      component.sortState
    );
  });

  it('should return correct selection states', () => {
    component.partList = MOCK_PART_ROW_LIST;
    component.existingParts = new Set([1]);
    expect(component.isAllSelected()).toBeFalse();
    expect(component.isIndeterminate()).toBeTrue();

    component.existingParts = new Set([1, 2]);
    expect(component.isAllSelected()).toBeTrue();
  });

  it('should close dialog without selection on cancel', () => {
    component.closeDialog();
    expect(mockDialogRef.close).toHaveBeenCalledWith({ action: 'NO_ACTION' });
  });

  it('should update paginated data based on current page and page size', () => {
    component.partList = [
      { partId: 1, partName: 'Part A', partNumber: 'PA-001', categoryName: 'Cat1', type: 'Type1', unit: 'PCS', vendorNames: [] },
      { partId: 2, partName: 'Part B', partNumber: 'PB-002', categoryName: 'Cat2', type: 'Type2', unit: 'PCS', vendorNames: [] },
      { partId: 3, partName: 'Part C', partNumber: 'PC-003', categoryName: 'Cat3', type: 'Type3', unit: 'PCS', vendorNames: [] }
    ];
    component.pageSize = 2;
    component.currentPage = 1; // Should give the 3rd item only

    component.updatePaginatedData();

    expect(component.paginatedData.length).toBe(1);
    expect(component.paginatedData[0].partId).toBe(3);
  });

  it('should return correct sort icon based on sort state', () => {
    component.sortState = { sortColumn: 'partName', sortState: SortIcons.ASC };
    expect(component.getSortIcon('partName')).toBe(SortIcons.ASC);

    component.sortState = { sortColumn: 'partName', sortState: SortIcons.DESC };
    expect(component.getSortIcon('partName')).toBe(SortIcons.DESC);

    component.sortState = { sortColumn: 'otherColumn', sortState: SortIcons.DEFAULT };
    expect(component.getSortIcon('partName')).toBe(SortIcons.DEFAULT);
  });

  it('should toggle sort order from asc to desc when same column is clicked again', () => {
    component.sortState = { sortColumn: 'partName', sortState: SortIcons.ASC };
    spyOn(component, 'applySort');
    component.toggleSort('partName');

    expect(component.sortState.sortState).toBe(SortIcons.DESC);
    expect(component.applySort).toHaveBeenCalledWith(component.sortState);
  });

it('should filter out excluded partId from part list', () => {
  component.data = { existingParts: new Set(), excludePartId: '1' };
  mockPartService.getPartList.and.returnValue(of(MOCK_PART_LIST_RESPONSE));

  component.getPartList(); // call manually since ngOnInit already ran
  expect(component.partList.length).toBe(1);
  expect(component.partList.some(p => p.partId === 1)).toBeFalse();
});


});
