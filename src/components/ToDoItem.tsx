import { Todo, Category } from "../types/types";

interface ToDoItemProps {
    todo: Todo;
    categories: Category[];
    showCategory: boolean;
}

const urgencyColors: Record<number, string> = {
    1: "bg-green-500",  // Low Urgency
    2: "bg-yellow-500", // Medium Urgency
    3: "bg-red-500",    // High Urgency
};

const ToDoItem = ({ todo, categories, showCategory }: ToDoItemProps) => {
    const categoryName = categories.find((c) => c.id === todo.categoryId)?.text || "No Category";
    const urgencyColor = urgencyColors[todo.urgency ?? 0] || "bg-transparent"; // Default to no color

    return (
        <li className={`relative flex flex-col bg-gray-700 p-2 rounded text-gray-300 ${todo.completed ? 'opacity-50' : ''}`}>
            {/* Urgency Line */}
            <div className={`absolute left-0 top-0 h-full w-2 ${urgencyColor} rounded-l`}></div>

            {/* Todo Content */}
            <div className="pl-3">
                <span className="font-semibold text-lg text-sky-400">{todo.text}</span>
                {showCategory && todo.categoryId && (
                    <div className="text-sm font-semibold text-gray-400 mt-1">{categoryName}</div>
                )}
            </div>
        </li>
    );
};

export default ToDoItem;
