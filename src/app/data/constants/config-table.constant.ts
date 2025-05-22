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

export const PART_ATTRIBUTE_TABLE_COLUMNS = [
    {
        label: 'Part Attributes',
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

export const PART_TEMPLATE_TABLE_COLUMNS = [
    {
        label: 'Part Templates',
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