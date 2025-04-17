import { ColumnType, TableActions } from "../../shared/constants/table.constants";

export const COST_FACTOR_TABLE_COLUMNS = [
    {
        label: 'Cost Factor',
        key: 'name',
        columnType: ColumnType.GENERAL,
    },
    {
        label: 'Value',
        key: 'value',
        columnType: ColumnType.INPUT_NUMBER,
    },
        {
            label: 'Actions',
            columnType: ColumnType.ACTION,
            actions: [
                TableActions.DELETE
            ]
        }
];