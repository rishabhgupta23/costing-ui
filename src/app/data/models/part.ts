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
}

