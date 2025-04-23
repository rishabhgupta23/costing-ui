export interface Category{
    categoryId?: number,
    name: string
}

export interface TableActionEvent {
    action: string;
    row: any;
}