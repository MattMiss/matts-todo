import { useState } from "react";
import { FaPlus, FaCaretDown, FaCaretUp, FaCheck, FaEdit  } from "react-icons/fa";
import { Todo } from "../types/types";
import CategoryModal from "./CategoryModal";
import TodoModal from "./TodoModal";
import ToDoItem from "./ToDoItem";
import { useTodos } from "../context/todo/useTodosContext";
import { useCategories } from "../context/category/useCategoriesContext";

const ToDoList = () => {
    const { todos, deleteTodo } = useTodos();
    const { categories } = useCategories();
    
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    
    const [sortBy, setSortBy] = useState<"alphabetical" | "urgency">("alphabetical");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [groupByCategory, setGroupByCategory] = useState(false);

    const openNewTodoModal = () => {
        setEditingTodo(null);
        setIsTodoModalOpen(true);
    };

    const openEditTodoModal = (todo: Todo) => {
        setEditingTodo(todo);
        setIsTodoModalOpen(true);
    };

    const handleDeleteTodo = async (id: string) => {
        deleteTodo(id);
    };

    // **Sorting Logic**
    const sortTodos = (a: Todo, b: Todo) => {
        let comparison = 0;
        
        if (sortBy === "alphabetical") {
            comparison = a.text.localeCompare(b.text);
        } else if (sortBy === "urgency") {
            comparison = (a.urgency ?? 0) - (b.urgency ?? 0); // Default urgency to 0 if missing
        }

        return sortOrder === "asc" ? comparison : -comparison;
    };

    // **Grouping Logic**
    const groupedTodos = groupByCategory
        ? todos.reduce<Record<string, Todo[]>>((groups, todo) => {
              const categoryName = categories.find((c) => c.id === todo.categoryId)?.text || "No Category";
              if (!groups[categoryName]) groups[categoryName] = [];
              groups[categoryName].push(todo);
              return groups;
          }, {})
        : { All: todos };

    // **Sort categories alphabetically, but ensure "No Category" is last**
    const sortedCategoryGroups = Object.keys(groupedTodos).sort((a, b) => {
        if (a === "No Category") return 1; // Always place "No Category" last
        if (b === "No Category") return -1;
        return a.localeCompare(b);
    });

    return (
        <div className="max-w-xl mx-auto bg-gray-600 p-4 rounded shadow-md  text-white">
            <h2 className="text-xl font-semibold mb-4 text-white">To-Do List</h2>

            {/* Sorting & Grouping Controls */}
            <div className="flex flex-wrap gap-2 mb-4 text-sm">
            
                {/* Sort Select */}
                <div className="flex flex-1 items-center min-w-[150px]">
                    <div className="relative w-full">
                        <select
                            className="w-full bg-gray-700 p-2 rounded text-center appearance-none cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as "alphabetical" | "urgency")}
                        >
                            <option value="alphabetical">Sort by Name</option>
                            <option value="urgency">Sort by Urgency</option>
                        </select>
                        {/* Custom dropdown arrow */}
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <FaCaretDown size={20} />
                        </div>
                    </div>
                </div>

                {/* Sort Order Button */}
                <div className="flex flex-1 gap-2 justify-center items-center min-w-[150px]">
                    <button
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                        {sortOrder === "asc" ? (
                            <div className="flex gap-1 justify-center items-center">
                                Ascending <FaCaretUp size={20} />
                            </div>
                        ) : (
                            <div className="flex gap-1 justify-center items-center">
                                Descending <FaCaretDown size={20} />
                            </div>
                        )}
                    </button>
                </div>

                {/* Group by Category Checkbox */}
                <div className="flex flex-1 gap-2 items-center p-2 rounded cursor-pointer select-none bg-gray-700 text-white justify-center min-w-[150px]">
                    <label className="flex items-center gap-2 w-full justify-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={groupByCategory}
                            onChange={() => setGroupByCategory(!groupByCategory)}
                            className="hidden peer"
                        />
                        <span>Group by Category</span>
                        {/* Custom Checkbox */}
                        <div className={`w-4 h-4 bg-gray-200 rounded flex items-center justify-center peer-checked:bg-blue-500`}>
                            {groupByCategory && <FaCheck size={12} className="text-white" />}
                        </div>
                    </label>
                </div>
            </div>


            <div className="flex flex-wrap justify-between">
                {/* Open New To-Do Modal */}
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4 flex items-center gap-2 min-w-[150px]"
                    onClick={openNewTodoModal}
                >
                    <FaPlus /> New Todo
                </button>

                {/* Manage Categories Button */}
                <button
                    className="bg-gray-700 text-white px-4 py-2 rounded mb-4 flex items-center gap-2 min-w-[150px]"
                    onClick={() => setIsCategoryModalOpen(true)}
                >
                    <FaEdit /> Categories
                </button>
            </div>
            

            {/* To-Do List */}
            <ul className="space-y-4">
                {groupByCategory ? (
                    sortedCategoryGroups.map((category) => (
                        <li key={category}>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">{category}</h3>
                            <ul className="space-y-2">
                                {groupedTodos[category].sort(sortTodos).map((todo) => (
                                    <ToDoItem key={todo.id} todo={todo} categories={categories} showCategory={false} onEdit={openEditTodoModal} onDelete={handleDeleteTodo} />
                                ))}
                            </ul>
                        </li>
                    ))
                ) : (
                    todos.sort(sortTodos).map((todo) => (
                        <ToDoItem key={todo.id} todo={todo} categories={categories} showCategory={true} onEdit={openEditTodoModal} onDelete={handleDeleteTodo} />
                    ))
                )}
            </ul>

            {/* Todo Modal */}
            <TodoModal isOpen={isTodoModalOpen} onClose={() => setIsTodoModalOpen(false)} onSave={() => {}} currentTodo={editingTodo} />

            {/* Category Modal */}
            <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />
        </div>
    );
};

export default ToDoList;
