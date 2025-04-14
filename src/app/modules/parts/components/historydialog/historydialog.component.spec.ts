import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorydialogComponent } from './historydialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MOCK_COST_HISTORY_LIST } from '../../../../mock-data/part.mock-data'; // Update path as per your structure
import { DialogCloseResponse } from '../../../../shared/constants/dialog.constants';
import { COST_FACTOR_TABLE_COLUMNS } from '../../../../data/constants/part.constants';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { TableComponent } from '../../../../shared/components/table/table.component';

fdescribe('HistorydialogComponent', () => {
  let component: HistorydialogComponent;
  let fixture: ComponentFixture<HistorydialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<HistorydialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [HistorydialogComponent],
      imports: [MatTableModule, BrowserAnimationsModule, MatDialogModule, MatAccordion, MatExpansionModule,TableComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { costHistoryList: MOCK_COST_HISTORY_LIST } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistorydialogComponent);
    component = fixture.componentInstance;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<HistorydialogComponent>>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize historyList from dialog data', () => {
    expect(component.historyList).toEqual(MOCK_COST_HISTORY_LIST);
  });

  it('should close dialog with NO_ACTION on closeDialog()', () => {
    component.closeDialog();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ action: DialogCloseResponse.NO_ACTION });
  });
});
