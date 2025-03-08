import { useState } from "react";
import { FaPlus, FaCaretDown, FaCaretUp, FaCheck, FaEdit  } from "react-icons/fa";
import { Todo } from "../types/types";
import ToDoItem from "./ToDoItem";
import CategoryModal from "./CategoryModal";
import TodoModal from "./TodoModal";
import TodoActionModal from "./TodoActionModel";
import { useTodos } from "../context/todo/useTodosContext";
import { useCategories } from "../context/category/useCategoriesContext";

const ToDoList = () => {
    const { todos, completeTodo, deleteTodo } = useTodos();
    const { categories } = useCategories();
    
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    
    const [sortBy, setSortBy] = useState<"alphabetical" | "urgency">("alphabetical");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [groupByCategory, setGroupByCategory] = useState(false);
    const [hideCompleted, setHideCompleted] = useState(false);

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

    const handleToggleComplete = (id: string, completed: boolean) => {
        completeTodo(id, completed);
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

    // **Filter Completed & Incomplete Todos**
    const incompleteTodos = todos.filter((todo) => !todo.completed);
    const completedTodos = todos.filter((todo) => todo.completed);

    // **Grouping Logic**
    const groupedTodos = groupByCategory
        ? incompleteTodos.reduce<Record<string, Todo[]>>((groups, todo) => {
              const categoryName = categories.find((c) => c.id === todo.categoryId)?.text || "No Category";
              if (!groups[categoryName]) groups[categoryName] = [];
              groups[categoryName].push(todo);
              return groups;
          }, {})
        : { All: incompleteTodos };

    // **Sort categories alphabetically, but ensure "No Category" is last**
    const sortedCategoryGroups = Object.keys(groupedTodos).sort((a, b) => {
        if (a === "No Category") return 1; // Always place "No Category" last
        if (b === "No Category") return -1;
        return a.localeCompare(b);
    });

    return (
        <div className="max-w-xl mx-auto bg-gray-800 p-4 rounded shadow-lg shadow-gray-900 text-white">

            {/* Sorting & Grouping Controls */}
            <div className="flex flex-wrap gap-2 mb-4 text-sm">
            
                {/* Sort Select */}
                <div className="flex flex-1 items-center min-w-[150px]">
                    <div className="relative w-full">
                        <select
                            className="w-full bg-gray-600 hover:bg-gray-500 p-2 rounded text-center appearance-none cursor-pointer"
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
                        className="w-full bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
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
                <div className="flex flex-1 gap-2 items-center p-2 rounded cursor-pointer select-none bg-gray-600 hover:bg-gray-500 text-white justify-center min-w-[150px]">
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

                {/* Hide completed todos checkbox */}
                <div className="flex flex-1 gap-2 items-center p-2 rounded cursor-pointer select-none bg-gray-600 hover:bg-gray-500 text-white justify-center min-w-[150px]">
                    <label className="flex items-center gap-2 w-full justify-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={hideCompleted}
                            onChange={() => setHideCompleted(!hideCompleted)}
                            className="hidden peer"
                        />
                        <span>Hide Completed</span>
                        {/* Custom Checkbox */}
                        <div className={`w-4 h-4 bg-gray-200 rounded flex items-center justify-center peer-checked:bg-blue-500`}>
                            {hideCompleted && <FaCheck size={12} className="text-white" />}
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
            

            {/* Incomplete Todos */}
            <ul className="space-y-4">
                {groupByCategory ? (
                    sortedCategoryGroups.map((category) => (
                        <li key={category}>
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">{category}</h3>
                            <ul className="space-y-2">
                                {groupedTodos[category].sort(sortTodos).map((todo) => (
                                    <div 
                                        key={todo.id} 
                                        onClick={() => {
                                            setSelectedTodo(todo);
                                            setIsActionModalOpen(true);
                                        }} 
                                        className="cursor-pointer"
                                    >
                                        <ToDoItem todo={todo} categories={categories} showCategory={false} />
                                    </div>
                                ))}
                            </ul>
                        </li>
                    ))
                ) : (
                    incompleteTodos.sort(sortTodos).map((todo) => (
                        <div 
                            key={todo.id} 
                            onClick={() => {
                                setSelectedTodo(todo);
                                setIsActionModalOpen(true);
                            }} 
                            className="cursor-pointer"
                        >
                            <ToDoItem todo={todo} categories={categories} showCategory={true} />
                        </div>
                    ))
                )}
            </ul>

            {/* Completed Todos */}
            {!hideCompleted && completedTodos.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Completed Todos</h3>
                    <ul className="space-y-2">
                        {completedTodos.sort(sortTodos).map((todo) => (
                            <div 
                                key={todo.id} 
                                onClick={() => {
                                    setSelectedTodo(todo);
                                    setIsActionModalOpen(true);
                                }} 
                                className="cursor-pointer"
                            >
                                <ToDoItem todo={todo} categories={categories} showCategory={true} />
                            </div>
                        ))}
                    </ul>
                </div>
            )}

            {/* Todo Modal */}
            <TodoModal isOpen={isTodoModalOpen} onClose={() => setIsTodoModalOpen(false)} onSave={() => {}} currentTodo={editingTodo} />

            {/* Category Modal */}
            <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />

            {/* Action Modal for Todo */}
            <TodoActionModal
                isOpen={isActionModalOpen}
                onClose={() => setIsActionModalOpen(false)}
                todo={selectedTodo}
                onToggleComplete={handleToggleComplete}
                onEdit={openEditTodoModal}
                onDelete={handleDeleteTodo}
            />
        </div>
    );
};

export default ToDoList;
