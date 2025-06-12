import { ColumnType, TableActions } from "../../shared/constants/table.constants";

export const VENDOR_TABLE_COLUMNS = [
    {
        label: 'Name',
        columnType: ColumnType.GENERAL,
        key: 'vendorName',
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
        label: 'Contact No.',
        columnType: ColumnType.GENERAL,
        key: 'contactNumber',
        filterable: true,
        sortable: true
    },
    {
        label: 'Address',
        columnType: ColumnType.GENERAL,
        key: 'address',
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