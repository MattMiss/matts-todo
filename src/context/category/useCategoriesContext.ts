import { useContext } from "react";
import { CategoriesContext } from "./categoriesContext";

export const useCategories = () => {
    const context = useContext(CategoriesContext);
    if (!context){
        throw new Error("useTodos must be used within a TodosProvider");
    }
    return context;
}