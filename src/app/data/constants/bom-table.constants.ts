import { ColumnType } from "../../shared/constants/table.constants";

export const BOM_TABLE_COLUMNS = [
    {
        label: 'Sl. No.',
        columnType: ColumnType.SERIAL_NUMBER,
    },
    {
        label: 'Part Number',
        key: 'partNumber',
        columnType:ColumnType.GENERAL
    },
    {
        label: 'Part Name',
        key: 'partName',
        columnType: ColumnType.GENERAL,
    },
    {
        label: 'Quantity',
        key: 'value',
        columnType: ColumnType.INPUT_NUMBER,
    }
];