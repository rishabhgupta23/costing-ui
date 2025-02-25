import { ColumnType, TableActions } from "../../shared/constants/table.constants";

export const PART_TABLE_COLUMNS = [
    {
        label: 'Sl. No.',
        columnType: ColumnType.SERIAL_NUMBER,
    },
    {
        label: 'Part Number',
        columnType: ColumnType.GENERAL,
        key: 'partNumber',
    },
    {
        label: 'Part Name',
        columnType: ColumnType.GENERAL,
        key: 'partName',
    },
    {
        label: 'Measuring Unit',
        columnType: ColumnType.GENERAL,
        key: 'unit',
    },
    {
        label: 'Type',
        columnType: ColumnType.GENERAL,
        key: 'type'
    },
    {
        label: 'Category',
        columnType: ColumnType.GENERAL,
        key: 'category'
    },
    {
        label: 'Actions',
        columnType: ColumnType.ACTION,
        actions: [
            TableActions.EDIT,TableActions.DELETE
        ]
    }
]