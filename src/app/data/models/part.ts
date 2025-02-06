export interface CostFactor {
    id:number;
    name: string;
}

export interface CostFactorData {
    id: number;
    name: string;
    value: number;
}

export interface VendorCostFactorData {
    vendorId: number;
    costFactorValues: Map<number,number>
}


export interface PartCreateRequest {
    partName: string;
    partNumber: string;
    categoryId: number;
    partType: string;
    partUnit: string;
    vendorCostMap: any;
    bomDetails:any[];
}

export interface PartBomData{
    id: number;
    partNumber: string;
    partName: string;
    quantity: number
}

export interface PartRow{
    partId: number;
    partName: string;
    partNumber: string;
    categoryName: string;
    type: string;
    unit: string;
}

export interface TableActionEvent {
    action: string;
    row: any;
  }