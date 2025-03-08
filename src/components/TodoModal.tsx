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
    const [urgency, setUrgency] = useState<number>(1);

    useEffect(() => {
        if (isOpen) {
            if (currentTodo) {
                setText(currentTodo.text);
                setCategoryId(currentTodo.categoryId || null);
                setUrgency(currentTodo.urgency);
            } else {
                setText("");
                setCategoryId(null);
                setUrgency(1);
            }
        }
    }, [isOpen, currentTodo]);

    const handleSave = async () => {
        if (!text.trim()) return;

        if (currentTodo) {
            updateTodo(currentTodo.id, text, categoryId || undefined, urgency);
        } else {
            addTodo(text, categoryId || undefined, urgency);
        }

        onSave();
        onClose();
    };

    const handleCancel = () => {
        onClose(); // Close modal without saving changes
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-gray-900/90 flex justify-center items-center">
                <div className="bg-gray-700 px-10 py-6 rounded shadow-md w-md">
                    <h2 className="text-xl mb-4">{currentTodo ? "Edit Todo" : "New Todo"}</h2>

                    {/* Todo Text Input */}
                    <input
                        type="text"
                        className="p-2 rounded w-full mb-4 bg-gray-600"
                        placeholder="Enter todo..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    {/* Category Selection */}
                    <label className="block text-gray-300 mb-1">Category</label>
                    <select
                        className="p-2 rounded w-full mb-4 bg-gray-600"
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

                    {/* Urgency Selection as Buttons */}
                    <label className="block text-gray-300 mb-1">Urgency</label>
                    <div className="flex justify-between gap-4 mb-4">
                        {[
                            { value: 1, label: "Low", color: "bg-green-500" },
                            { value: 2, label: "Medium", color: "bg-yellow-500" },
                            { value: 3, label: "High", color: "bg-red-500" },
                        ].map(({ value, label, color }) => (
                            <button
                                key={value}
                                className={`px-4 py-2 rounded w-full text-white ${color} ${
                                    urgency === value ? "border-3 border-blue-500" : "opacity-40"
                                }`}
                                onClick={() => setUrgency(value)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <button className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-2" onClick={handleSave}>
                        {currentTodo ? "Update" : "Add"}
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded w-full mt-4" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        )
    );
};

export default TodoModal;
