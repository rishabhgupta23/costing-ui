// src/app/mock-data/cost.mock-data.ts
import { Part } from '../data/models/part';
import { CostItem } from '../data/models/cost-calculator';

export const mockPartList: any[] = [
    { partId: 1, partName: 'Bolt', partNumber: 'B123', categoryId: 1, type: 'Fastener', unit: 'Piece' },
    { partId: 2, partName: 'Nut', partNumber: 'N456', categoryId: 1, type: 'Fastener', unit: 'Piece' }
  ];
  
  
  

export const mockCostResponse: {
  costCalcDtoList: CostItem[];
  totalCost: number;
} = {
  costCalcDtoList: [{
    partName: 'Washer',
    partNumber: 'W123',
    quantity: 1,
    subTotal: 50,
    vendorName: 'TestVendor',
    rate: 50
  } as CostItem],
  totalCost: 50
};
