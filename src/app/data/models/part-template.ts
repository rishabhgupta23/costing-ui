export interface TemplateRequest {
    name: string;
    partAttributes: number[];
  }
  
  export interface TemplateResponse {
    templateId: number;
    name: string;
    partAttributes: {
      attributeId: number;
      name: string;
    }[];
  }
  
  export interface TemplateListItem {
    templateId: number;
    name: string;
  }
  
  export interface AttributeRow{
    attributeId: number;
    name: string;
  }