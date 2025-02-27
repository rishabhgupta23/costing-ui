import { ColumnType } from "../../shared/constants/table.constants";

export const COST_CALCULATOR_COLUMNS = [
    {
        label: 'Sl. No.',
        columnType: ColumnType.SERIAL_NUMBER,
    },
    {
        label: 'Part Number',
        key: 'partNumber',
        columnType:ColumnType.GENERAL
    },
    {
        label: 'Part Name',
        key: 'partName',
        columnType: ColumnType.GENERAL,
    },
    {
        label: 'Rate',
        key: 'rate',
        columnType: ColumnType.GENERAL,
    },
    {
        label: 'Quantity',
        key: 'quantity',
        columnType: ColumnType.GENERAL,
    },
    {
        label: 'Sub Total',
        key:'subTotal',
        columnType: ColumnType.GENERAL,
    },
    {
        label:'Vendor',
        key: 'vendorName',
        columnType: ColumnType.GENERAL,
    }

];