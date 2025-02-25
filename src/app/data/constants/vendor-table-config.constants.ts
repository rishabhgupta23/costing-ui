import { ColumnType } from "../../shared/constants/table.constants";

export const VENDOR_TABLE_COLUMNS = [
    {
        label: 'Sl. No.',
        columnType: ColumnType.SERIAL_NUMBER,
    },
    {
        label: 'Name',
        columnType: ColumnType.GENERAL,
        key: 'name',
        filterable: true
    },
    {
        label: 'Email ID',
        columnType: ColumnType.GENERAL,
        key: 'emailId',
        filterable: true
    },
    {
        label: 'Contact No.',
        columnType: ColumnType.GENERAL,
        key: 'contactNumber',
        filterable: true
    },
    {
        label: 'Address',
        columnType: ColumnType.GENERAL,
        key: 'address',
        filterable: true
    }
]