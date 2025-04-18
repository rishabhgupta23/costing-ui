import { ColumnType, TableActions } from "src/app/shared/constants/table.constants";

export const CATEGORY_TABLE_COLUMNS = [
    {
        label: 'Category Name',
        key: 'name',
        columnType: ColumnType.GENERAL
    },
    {
        label: 'Actions',
        columnType: ColumnType.ACTION,
        actions: [
            TableActions.EDIT,TableActions.DELETE
        ]
    }
]