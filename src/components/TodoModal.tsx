import { useState, useEffect } from "react";
import { Todo } from "../types/types";
import { useTodos } from "../context/todo/useTodosContext";
import { useCategories } from "../context/category/useCategoriesContext";

interface TodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    currentTodo?: Todo | null;
}

const TodoModal = ({ isOpen, onClose, onSave, currentTodo }: TodoModalProps) => {
    const { addTodo, updateTodo } = useTodos();
    const { categories } = useCategories();
    const [text, setText] = useState("");
    const [categoryId, setCategoryId] = useState<string | null>(null);


    useEffect(() => {
        if (isOpen) {
            if (currentTodo) {
                setText(currentTodo.text);
                setCategoryId(currentTodo.categoryId || null);
            } else {
                setText("");
                setCategoryId(null);
            }
        }
    }, [isOpen, currentTodo]);

    const handleSave = async () => {
        if (!text.trim()) return;

        if (currentTodo) {
            updateTodo(currentTodo.id, text, categoryId || undefined);
        } else {
            addTodo(text, categoryId || undefined);
        }

        onSave();
        onClose();
    };

    const handleCancel = () => {
        onClose(); // Close modal without saving changes
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded shadow-md w-80">
                    <h2 className="text-xl mb-4">{currentTodo ? "Edit Todo" : "New Todo"}</h2>

                    <input
                        type="text"
                        className="border p-2 rounded w-full mb-2"
                        placeholder="Enter todo..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <select
                        className="border p-2 rounded w-full mb-4"
                        value={categoryId || ""}
                        onChange={(e) => setCategoryId(e.target.value || null)}
                    >
                        <option value="">No Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.text}
                            </option>
                        ))}
                    </select>

                    <div className="flex justify-between">
                        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
                            {currentTodo ? "Update" : "Add"}
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default TodoModal;
