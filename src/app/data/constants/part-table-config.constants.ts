import { ColumnType, TableActions } from "../../shared/constants/table.constants";

export const PART_TABLE_COLUMNS = [
    {
        label: 'Part Number',
        columnType: ColumnType.GENERAL,
        key: 'partNumber',
        filterable: true,
        sortable: true
    },
    {
        label: 'Part Name',
        columnType: ColumnType.GENERAL,
        key: 'partName',
        filterable: true,
        sortable: true
    },
    {
        label: 'Measuring Unit',
        columnType: ColumnType.GENERAL,
        key: 'unit',
        filterable: true,
        sortable: true
    },
    {
        label: 'Type',
        columnType: ColumnType.GENERAL,
        key: 'type',
        filterable: true,
        sortable: true
    },
    {
        label: 'Category',
        columnType: ColumnType.GENERAL,
        key: 'categoryName',
        filterable: true,
        sortable: true
    },
    {
        label: 'Actions',
        columnType: ColumnType.ACTION,
        actions: [
            TableActions.EDIT,TableActions.DELETE
        ]
    }
]