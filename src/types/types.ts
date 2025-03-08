
export type Todo = {
    id: string;
    text: string;
    createdAt: number;
    urgency: number;
    completed: boolean;
    categoryId?: string;
}

export type Category = {
    id: string;
    text: string;
}