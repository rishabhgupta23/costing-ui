import { Vendor } from "./vendor";

export interface CostFactor {
    id:number;
    name: string;
}

export interface CostFactorData {
    id: number;
    name?: string;
    value: number;
}

export interface CostHistory {
    updatedDateTime: string;
    costFactorValueList: CostFactorData[];
}

export interface CostHistoryResponse {
    partId: number;
    vendorId: number;
    costHistoryList: CostHistory[];
}


export interface VendorCost extends Vendor {
    costFactorValues: CostFactorData[];
}

export interface Part {
    partName: string;
    partNumber: string;
    categoryId: number;
    type: string;
    unit: string;
}

export interface PartCreateRequest extends Part {
    vendorCostList: VendorCost[];
    bom:{ childPartId: number; quantity: number }[];
}

export interface PartBomData{
    id: number;
    partNumber: string;
    partName: string;
    value: number;
}


export interface PartRow{
    partId: number;
    partName: string;
    partNumber: string;
    categoryName: string;
    type: string;
    unit: string;
    vendorNames?: string[];
}

export interface PartDetails extends Part {
    bom: {childPartId: number; quantity: number; childPartName: string; childPartNumber: string}[];
    vendorCostList: VendorCost[];
}

export interface TableActionEvent {
    action: string;
    row: any;
  }