import { useState, useEffect } from "react";
import { Category } from "../types/types";
import { useCategories } from "../context/category/useCategoriesContext";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CategoryModal = ({ isOpen, onClose }: CategoryModalProps) => {
    const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
    const [newCategory, setNewCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        if (isOpen) {
            setEditingCategory(null);
            setEditText("");
        }
    }, [isOpen]);

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        addCategory(newCategory);
        setNewCategory("");
    };

    const handleUpdateCategory = async () => {
        if (!editingCategory || !editText.trim()) return;
        updateCategory(editingCategory.id, editText);
        setEditingCategory(null);
        setEditText("");
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setEditText("");
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                <div className="bg-gray-500 p-4 rounded shadow-md w-80">
                    <h2 className="text-xl mb-4">Manage Categories</h2>

                    <div>
                        <input
                            type="text"
                            className="p-2 rounded w-full mb-2 bg-gray-600"
                            placeholder="New category..."
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4" onClick={handleAddCategory}>
                            Add Category
                        </button>
                    </div>

                    <ul>
                        {categories.map((category) => (
                            <li key={category.id} className="flex justify-between items-center bg-gray-600 p-2 rounded mb-2">
                                {editingCategory?.id === category.id ? (
                                    <input
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="border p-2 rounded"
                                    />
                                ) : (
                                    <span>{category.text}</span>
                                )}
                                <div className="flex gap-2">
                                    {editingCategory?.id === category.id ? (
                                        <>
                                            <button className="text-green-600" onClick={handleUpdateCategory}>
                                                ✅
                                            </button>
                                            <button className="text-gray-600" onClick={handleCancelEdit}>
                                                ❌
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="text-blue-600"
                                            onClick={() => {
                                                setEditingCategory(category);
                                                setEditText(category.text);
                                            }}
                                        >
                                            ✏️
                                        </button>
                                    )}
                                    <button className="text-red-600" onClick={() => deleteCategory(category.id)}>
                                        🗑️
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button className="bg-red-500 text-white px-4 py-2 rounded w-full mt-4" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        )
    );
};

export default CategoryModal;
