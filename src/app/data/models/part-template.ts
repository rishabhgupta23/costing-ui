export interface TemplateRequest {
    templateName: string;
    partAttributes: number[];
  }
  
  export interface TemplateResponse {
    templateId: number;
    templateName: string;
    partAttributes: AttributeRow[];
  }
  
  export interface TemplateListItem {
    templateId: number;
  templateName: string;
  }
  
  export interface AttributeRow{
    attributeId: number;
    attributeName: string;
  }