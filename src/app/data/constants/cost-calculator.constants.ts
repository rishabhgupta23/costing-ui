import { ColumnType } from "../../shared/constants/table.constants";

export const COST_CALCULATOR_COLUMNS=(editable = false) => [
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
        columnType: editable ? ColumnType.INPUT_NUMBER : ColumnType.GENERAL,
    },
    {
        label: 'Quantity',
        key: 'quantity',
        columnType: editable ? ColumnType.INPUT_NUMBER : ColumnType.GENERAL,
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