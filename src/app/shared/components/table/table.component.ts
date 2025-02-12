import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ColumnType, TableActions } from '../../constants/table.constants';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() config: any[] = [];
  @Output() actionTriggered = new EventEmitter<{ action: TableActions; row: any }>();
  TableActions = TableActions;

  handleAction(event: { action: TableActions; row: any }): void {
    const { action, row } = event;
    this.actionTriggered.emit({ action, row });
  }

  ColumnType = ColumnType;
  router: Router = inject(Router);
}
