export interface Vendor {
    id: number;
    vendorName?: string;
    emailId?: string;
    contactNumber?: string;
    address?: string;
}

export interface TableActionEvent {
    action: string;
    row: any;
  }