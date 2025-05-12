import { ColumnType, TableActions } from "src/app/shared/constants/table.constants";

export const CATEGORY_TABLE_COLUMNS = [
    {
        label: 'Category Name',
        key: 'name',
        columnType: ColumnType.GENERAL,
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

export const COSTFACTOR_TABLE_COLUMNS = [
    {
        label: 'Cost Factor',
        key: 'factorName',
        columnType: ColumnType.GENERAL,
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