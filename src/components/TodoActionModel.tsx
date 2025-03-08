import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { Todo } from "../types/types";

interface TodoActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    todo: Todo | null;
    onToggleComplete: (id: string, completed: boolean) => void;
    onEdit: (todo: Todo) => void;
    onDelete: (id: string) => void;
}

const TodoActionModal = ({ isOpen, onClose, todo, onToggleComplete, onEdit, onDelete }: TodoActionModalProps) => {
    if (!isOpen || !todo) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/90 flex justify-center items-center">
            <div className="bg-gray-700 px-10 py-6 rounded shadow-md w-md">
                <h2 className="text-xl font-semibold mb-4 text-sky-400">{todo.text}</h2>

                <button
                    className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded mb-2"
                    onClick={() => {
                        onToggleComplete(todo.id, !todo.completed);
                        onClose();
                    }}
                >
                    <FaCheck />
                    {todo.completed ? "Mark as Uncompleted" : "Mark as Completed"}
                </button>

                <button
                    className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded mb-2"
                    onClick={() => {
                        onEdit(todo);
                        onClose();
                    }}
                >
                    <FaEdit />
                    Edit Todo
                </button>

                <button
                    className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                        onDelete(todo.id);
                        onClose();
                    }}
                >
                    <FaTrash />
                    Delete Todo
                </button>

                <button className="bg-red-500 text-white px-4 py-2 rounded w-full mt-4" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default TodoActionModal;
