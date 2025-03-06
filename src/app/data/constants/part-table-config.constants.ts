import { ColumnType, TableActions } from "../../shared/constants/table.constants";

export const PART_TABLE_COLUMNS = [
    {
        label: 'Sl. No.',
        columnType: ColumnType.SERIAL_NUMBER,
        filterable: false
    },
    {
        label: 'Part Number',
        columnType: ColumnType.GENERAL,
        key: 'partNumber',
        filterable: true
    },
    {
        label: 'Part Name',
        columnType: ColumnType.GENERAL,
        key: 'partName',
        filterable: true
    },
    {
        label: 'Measuring Unit',
        columnType: ColumnType.GENERAL,
        key: 'unit',
        filterable: true
    },
    {
        label: 'Type',
        columnType: ColumnType.GENERAL,
        key: 'type',
        filterable: true
    },
    {
        label: 'Category',
        columnType: ColumnType.GENERAL,
        key: 'category',
        filterable: true
    },
    {
        label: 'Actions',
        columnType: ColumnType.ACTION,
        actions: [
            TableActions.EDIT,TableActions.DELETE
        ]
    }
]