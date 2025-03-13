import { SortIcons } from "../../shared/constants/table.constants";

export interface Vendor {
    id: number;
    name?: string;
    emailId?: string;
    contactNumber?: string;
    address?: string;
}

export interface TableActionEvent {
    action: string;
    row: any;
  }

  export interface SortState{
      sortColumn: string,
      sortState: SortIcons
  }