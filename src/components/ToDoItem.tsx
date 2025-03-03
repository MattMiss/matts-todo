import { FaTrash, FaEdit } from "react-icons/fa";
import { Todo, Category } from "../types/types";

interface ToDoItemProps {
    todo: Todo;
    categories: Category[];
    showCategory: boolean;
    onEdit: (todo: Todo) => void;
    onDelete: (id: string) => void;
}

const urgencyLabels: Record<number, string> = {
    1: "Low",
    2: "Medium",
    3: "High",
};

const ToDoItem = ({ todo, categories, showCategory, onEdit, onDelete }: ToDoItemProps) => {
    const categoryName = categories.find((c) => c.id === todo.categoryId)?.text || "No Category";
    const urgencyLabel = urgencyLabels[todo.urgency ?? 0]; // Default to empty if no urgency

    return (
        <li className="flex flex-col bg-gray-400 p-2 rounded text-gray-300">
            <div className="flex justify-between items-center">
                <span className="font-semibold text-lg text-blue-600">{todo.text}</span>
                <div className="flex gap-2">
                    <button className="text-blue-500" onClick={() => onEdit(todo)}>
                        <FaEdit />
                    </button>
                    <button onClick={() => onDelete(todo.id)} className="text-red-500">
                        <FaTrash />
                    </button>
                </div>
            </div>
            {showCategory && todo.categoryId && <span className="text-sm font-semibold">Category: {categoryName}</span>}
            {todo.urgency && <span className="text-sm font-semibold">Urgency: {urgencyLabel}</span>}
        </li>
    );
};

export default ToDoItem;
