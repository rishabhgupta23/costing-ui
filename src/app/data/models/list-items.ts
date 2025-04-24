export interface ListItems{
    id?: number,
    name: string
}

export interface TableActionEvent {
    action: string;
    row: any;
}