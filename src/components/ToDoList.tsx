import { useState } from "react";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { Todo } from "../types/types";
import CategoryModal from "./CategoryModal";
import TodoModal from "./TodoModal";
import { useTodos } from "../context/todo/useTodosContext";
import { useCategories } from "../context/category/useCategoriesContext";

const ToDoList = () => {
    const {todos, deleteTodo, } = useTodos();
    //const [todos, setTodos] = useState<Todo[]>([]);
    const { categories }= useCategories();
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

    const openNewTodoModal = () => {
        setEditingTodo(null);
        setIsTodoModalOpen(true);
    };

    const openEditTodoModal = (todo: Todo) => {
        setEditingTodo(todo);
        setIsTodoModalOpen(true);
    };

    const handleTodoSaved = () => {
        
    };

    const handleDeleteTodo = async (id: string) => {
        deleteTodo(id);
    };

    return (
        <div className="max-w-md mx-auto bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">To-Do List</h2>

            {/* Open New To-Do Modal */}
            <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4 flex items-center gap-2" onClick={openNewTodoModal}>
                <FaPlus /> New Todo
            </button>

            {/* Manage Categories Button */}
            <button className="bg-gray-500 text-white px-4 py-2 rounded mb-4 flex items-center gap-2" onClick={() => setIsCategoryModalOpen(true)}>
                <FaPlus /> Manage Categories
            </button>

            {/* To-Do List */}
            <ul className="space-y-2">
                {todos.map((todo) => (
                    <li key={todo.id} className="flex flex-col bg-gray-100 p-2 rounded">
                        <div className="flex justify-between items-center">
                            <span>{todo.text}</span>
                            <div className="flex gap-2">
                                <button className="text-blue-600" onClick={() => openEditTodoModal(todo)}>
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDeleteTodo(todo.id)} className="text-red-600">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                        {todo.categoryId && (
                            <span className="text-sm text-gray-600">
                                Category: {categories.find((c) => c.id === todo.categoryId)?.text || "Unknown"}
                            </span>
                        )}
                    </li>
                ))}
            </ul>

            {/* Todo Modal */}
            <TodoModal
                isOpen={isTodoModalOpen}
                onClose={() => setIsTodoModalOpen(false)}
                onSave={handleTodoSaved}
                currentTodo={editingTodo}
            />

            {/* Category Modal */}
            <CategoryModal 
                isOpen={isCategoryModalOpen} 
                onClose={() => setIsCategoryModalOpen(false)} 
            />
        </div>
    );
};

export default ToDoList;
