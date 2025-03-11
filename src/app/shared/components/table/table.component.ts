import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ColumnType, SortIcons, TableActions } from '../../constants/table.constants';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SortState } from '../../../data/models/part';

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
  @Input() sort: any = { sortColumn: '', sortSate: SortIcons.ASC }; 
  @Output() actionTriggered = new EventEmitter<{ action: TableActions; row: any }>();
  @Output() filterChange = new EventEmitter<{ key: string; value: string }>();
  @Output() sortChange = new EventEmitter<SortState>();
 
  TableActions= TableActions;
  ColumnType = ColumnType;


  
  onFilterChange(event: Event, key: string): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
       this.filterChange.emit({ key, value });
  }
  
  clearFilter(input: HTMLInputElement, columnKey: string): void {
    input.value = '';
    this.filterChange.emit({ key: columnKey, value: '' });
  }

  onSortChange(order: string, columnKey: string): void {
    this.sortChange.emit(this.sort);
  }

  toggleSort(columnKey: string): void {
    this.sort = {
      sortColumn: columnKey,
      sortState: this.sort.sortColumn !== columnKey ? SortIcons.ASC : 
                 this.sort.sortState === SortIcons.ASC ? SortIcons.DESC : SortIcons.ASC
    };
    this.sortChange.emit(this.sort);
  }
  
  getSortIcon(columnKey: string): string {
    return this.sort.sortColumn === columnKey 
      ? (this.sort.sortState === SortIcons.ASC ? SortIcons.ASC : SortIcons.DESC) 
      : SortIcons.DEFAULT;
  }
  



  handleAction(event: { action: TableActions; row: any }): void {
    const { action, row } = event;
    this.actionTriggered.emit({ action, row });
  }
  }

  
