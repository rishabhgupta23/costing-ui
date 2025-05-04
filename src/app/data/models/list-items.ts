export interface ListItems{
    id?: number,
    name: string
}

export interface CostFactorItems{
    id?: number,
    factorName: string
}

export interface TableActionEvent {
    action: string;
    row: any;
}