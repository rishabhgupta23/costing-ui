import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ColumnType } from '../../constants/table.constants';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule,
    MatInputModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() config: any[] = []; 
  @Input() showActions: boolean = false; // Determines whether to show the Actions column
  @Output() actionTriggered = new EventEmitter<{ action: string; row: any }>();

  handleAction(arg0: { action: string; row: any }): void {
    const { action, row } = arg0;
    this.actionTriggered.emit({ action, row });
  }

  ColumnType = ColumnType;
  router: Router = inject(Router);
}
