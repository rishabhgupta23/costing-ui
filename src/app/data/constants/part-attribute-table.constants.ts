import { ColumnType } from "../../shared/constants/table.constants";

export const PART_ATTRIBUTE_TABLE=(editable = false) => [
    {
        label: 'Attribute Name',
        key: 'attributeName',
        columnType: ColumnType.GENERAL,
    },
    {
        label: 'Value',
        key: 'value',
        columnType:editable? ColumnType.INPUT_STRING: ColumnType.GENERAL,
    }
];