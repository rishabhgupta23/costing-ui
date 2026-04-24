import { ColumnType } from "../../shared/constants/table.constants";

export const VENDOR_COST_TABLE_COLUMNS=[
    {
        label: 'Vendor Name',
        columnType: ColumnType.GENERAL,
        key: 'vendorName',
        filterable: true,
        
    },
    {
        label: 'Cost Factor',
        columnType: ColumnType.GENERAL,
        key: 'costFactor',
        filterable: true,
        
    },
    {
        label: 'Value',
        columnType: ColumnType.GENERAL,
        key: 'value',
        filterable: true,
        
    }
]