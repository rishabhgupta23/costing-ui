import { ColumnType } from "../../shared/constants/table.constants";

export const COST_FACTOR_TABLE_COLUMNS = [
    {
        label: 'Sl. No.',
        columnType: ColumnType.SERIAL_NUMBER,
    },
    {
        label: 'Cost Factor',
        key: 'name',
        columnType: ColumnType.GENERAL,
    },
    {
        label: 'Value',
        key: 'value',
        columnType: ColumnType.INPUT_NUMBER,
    }
];