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

@Input() showFilter: boolean = false;
@Input() showSort: boolean = true;

 applyFilter(arg0: { key: any; value: any; }) {
 throw new Error('Method not implemented.');
 }
  @Input() data: any[] = [];
  @Input() config: any[] = []; 
  @Output() actionTriggered = new EventEmitter<{ action: TableActions; row: any }>();
  @Output() filterChanged = new EventEmitter<{ key: string; value: string }>();
  @Output() sortChanged = new EventEmitter<{ key: string; order: string }>();
  
 
 
  TableActions= TableActions;
  ColumnType = ColumnType;

  sortedColumn: string | null = null;
  sortedOrder: 'asc' | 'desc' = 'asc';

  
  onFilterChange(event: Event, key: string): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
       this.filterChanged.emit({ key, value });
  }
  
  clearFilter(input: HTMLInputElement, columnKey: string): void {
    input.value = '';
    this.filterChanged.emit({ key: columnKey, value: '' });
  }

  onSortChange(order: string, columnKey: string): void {
    console.log(`Sorting ${columnKey} in ${order} order.`);
    this.sortChanged.emit({ key: columnKey, order });
  }

  toggleSort(columnKey: string): void {
    if (this.sortedColumn !== columnKey) {
      this.sortedColumn = columnKey;
      this.sortedOrder = 'asc';
    } else {
      this.sortedOrder = this.sortedOrder === 'asc' ? 'desc' : 'asc';
    }
    console.log(`Sorting ${columnKey} in ${this.sortedOrder} order.`);
    this.sortChanged.emit({ key: columnKey, order: this.sortedOrder });
  }

  // Return the appropriate SVG icon name based on sort state.
  getSortIcon(columnKey: string): string {
    if (this.sortedColumn === columnKey) {
      return this.sortedOrder === 'asc' ? 'asc' : 'desc';
    }
    return 'default-sort';
  }


  handleAction(event: { action: TableActions; row: any }): void {
    const { action, row } = event;
    this.actionTriggered.emit({ action, row });
  }
  }

  
