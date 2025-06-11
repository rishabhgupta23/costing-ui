import { TemplateListItem, TemplateResponse } from "../data/models/part-template";

// part-template.mock-data.ts
export const mockTemplateListItems: TemplateListItem[] = [
  { templateId: 1, templateName: 'Template A' },
  { templateId: 2, templateName: 'Template B' }
];

export const mockTemplateResponseList = {
  data: mockTemplateListItems,
  pageInfo: { totalRecords: 2 }
};

export const mockTemplateDetail: TemplateResponse = {
  templateId: 1,
  templateName: 'Template A',
  partAttributes: [{ attributeId: 1, attributeName: 'Color' }]
};
