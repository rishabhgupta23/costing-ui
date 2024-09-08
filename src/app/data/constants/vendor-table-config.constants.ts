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
    },
    {
        label: 'Email ID',
        columnType: ColumnType.GENERAL,
        key: 'emailId'
    },
    {
        label: 'Contact No.',
        columnType: ColumnType.GENERAL,
        key: 'contactNumber'
    },
    {
        label: 'Address',
        columnType: ColumnType.GENERAL,
        key: 'address'
    }
]