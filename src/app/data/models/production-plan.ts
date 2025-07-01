export interface ProductionRequestPart {
  partId: number;
  quantity: number;
}

export interface ProductionPlanRequest {
  priceMode: string;
  parts: ProductionRequestPart[];
}

export interface ProductionCostItem {
  partName: string;
  partNumber: string;
  quantity: number;
  rate: number;
  subTotal: number;
  vendorName: string;
}

export interface ProductionCostResponse {
  items: ProductionCostItem[];
  totalCost: number;
}