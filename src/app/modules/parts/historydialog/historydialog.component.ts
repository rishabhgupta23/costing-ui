import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { COST_FACTOR_TABLE_COLUMNS } from '../../../data/constants/part.constants';
import { ColumnType } from '../../../shared/constants/table.constants';
import { DialogCloseResponse } from '../../../shared/constants/dialog.constants';
import { CostHistory } from '../../../data/models/part';

@Component({
  selector: 'app-historydialog',
  templateUrl: './historydialog.component.html',
  styleUrl: './historydialog.component.scss'
})
export class HistorydialogComponent {
     historyList: CostHistory[];

     constructor( public dialogRef: MatDialogRef<HistorydialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { costHistoryList: any[] }
    ) {
      this.historyList = data.costHistoryList;
      console.log(this.historyList);
    }

      filteredCostFactorTableColumns = COST_FACTOR_TABLE_COLUMNS.map(col => {
        if (col.columnType === ColumnType.INPUT_NUMBER) {
          return { ...col, columnType: ColumnType.GENERAL };
        }
        if (col.columnType === ColumnType.ACTION) {
            return null;
        }
        if(col.columnType=== ColumnType.SERIAL_NUMBER){
          return null;
        }
        return col;
    }).filter(col => col !== null);


    closeDialog() {
      this.dialogRef.close({action: DialogCloseResponse.NO_ACTION});
      }
  }
