import { createContext } from "react";
import { Category } from "../../types/types";


interface CategoriesContextProps {
    isLoadingCategories: boolean;
    isUpdatingCategories: boolean;
    categories: Category[];
    refreshCategories: () => void;
    addCategory: (text: string) => void;
    updateCategory: (id: string, text: string) => void;
    deleteCategory: (id: string) => void;   
}

export const CategoriesContext = createContext<CategoriesContextProps | undefined>(undefined);