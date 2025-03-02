
export type Todo = {
    id: string;
    text: string;
    createdAt: number;
    categoryId?: string;
}

export type Category = {
    id: string;
    text: string;
}