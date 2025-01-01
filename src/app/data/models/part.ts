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
    partId: number;
    partName: string;
    partNumber: string;
    categoryId: number;
    partType: string;
    partUnit: string;
    vendorCostMap: any;
}

export interface BomDetailsData{
    id: number;
    name: string;
    value:number
}

export interface PartShow{
    partId: number;
    partName: string;
    partNumber: string;
    categoryName: string;
    type: string;
    unit: string;
}