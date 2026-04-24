import { SortIcons } from "../../shared/constants/table.constants";
import { Vendor } from "./vendor";

export interface CostFactor {
    id:number;
    factorName: string;
}

export interface PartAttribute {
    attributeId: number;
    attributeName: string;
}

export interface CostFactorData {
    id: number;
    factorName?: string;
    value: number;
}

export interface CostHistory {
    updatedDateTime: string;
    costFactorList: CostFactorData[];
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
    categoryName?: string;
    type: string;
    unit: string;
}

export interface PartCreateRequest extends Part {
    vendorCostList: VendorCost[];
    bom:{ childPartId: number; quantity: number }[];
  attributeValueList?: PartAttributeValue[];
}

export interface PartBomData{
    id: number;
    partNumber: string;
    partName: string;
    value: number;
}

export interface GeneralResponseDto{
    message: string;
    status: number
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
     attributeValueList?: PartAttributeValue[];
}

export interface SortState{
    sortColumn: string,
    sortState: SortIcons
}

export interface TableActionEvent {
    action: string;
    row: any;
  }

  export interface PartAttributeValue {
  attributeId: number;
  attributeName?:string;
  value: string;
  deleteFlag?: number;
}