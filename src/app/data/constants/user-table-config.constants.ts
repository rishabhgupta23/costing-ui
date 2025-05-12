import { ColumnType, TableActions } from "../../shared/constants/table.constants";

export const USER_TABLE_COLUMNS = [
    {
        label: 'User Name',
        columnType: ColumnType.GENERAL,
        key: 'displayName',
        filterable: true,
        sortable: true
    },
    {
        label: 'Email ID',
        columnType: ColumnType.GENERAL,
        key: 'emailId',
        filterable: true,
        sortable: true
    },
    {
        label: 'Role Name',
        columnType: ColumnType.GENERAL,
        key: 'roleName',
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