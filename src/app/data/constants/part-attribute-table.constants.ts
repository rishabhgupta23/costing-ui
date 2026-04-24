import { TemplateRef } from "@angular/core";
import { ColumnType } from "src/app/shared/constants/table.constants";

export const PART_ATTRIBUTE_TABLE=(editable = false,attributeNameTemplate?: TemplateRef<any>) => [
    {
        label: 'Attribute Name',
        key: 'attributeName',
        columnType: ColumnType.GENERAL,
        cellTemplate: attributeNameTemplate,   
    },
    {
        label: 'Value',
        key: 'value',
        columnType:editable? ColumnType.INPUT_STRING: ColumnType.GENERAL,
    }
];