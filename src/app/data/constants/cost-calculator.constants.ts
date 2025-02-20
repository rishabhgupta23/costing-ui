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
        label: 'Quantity',
        key: 'value',
        columnType: ColumnType.GENERAL,
    },
    {
        label: 'Price',
        key:'cost',
        columnType: ColumnType.GENERAL,
    },
    {
        label: 'Quantity * Price',
        key: 'qp',
        columnType: ColumnType.GENERAL,
    },
    {
        label:'Vendor',
        key: 'vendorName',
        columnType: ColumnType.GENERAL,
    }

];