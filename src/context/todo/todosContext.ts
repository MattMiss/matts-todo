import { createContext } from "react";
import { Todo } from "../../types/types";


interface TodosContextProps {
    isLoadingTodos: boolean;
    isUpdatingTodos: boolean;
    todos: Todo[];
    refreshTodos: () => void;
    addTodo: (text: string, categoryId: string | undefined, urgency: number) => void;
    updateTodo: (id: string, text: string, categoryId: string | undefined, urgency: number) => void;
    deleteTodo: (id: string) => void;   
}

export const TodosContext = createContext<TodosContextProps | undefined>(undefined);