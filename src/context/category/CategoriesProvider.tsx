import { db } from "../../firebase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../auth/useAuthContext";
import { CategoriesContext } from "./categoriesContext";
import { Category } from "../../types/types";


const CategoriesProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth();
    const queryClient = useQueryClient();

    // Fetch categories from firebase
    const fetchCategories = async (): Promise<Category[]> => {
        if (!currentUser) return [];

        const q = query(collection(db, "categories"), where("userId", "==", currentUser.uid));

        return getDocs(q).then((snapshot) => {
            const categories: Category[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Category[];
            
            return categories;
        });
    };

    // Use TanStack Query to manage the fetching and caching
    const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
        queryKey: ["categories", currentUser?.uid],
        queryFn: fetchCategories,
        enabled: !!currentUser, // Fetch only if user is logged in
        staleTime: 1000 * 60 * 5, // 5 minutes cache time
        gcTime: 1000 * 60 * 10, // 10 minutes before removal
    });

    // Mutation to add a new category
    const addCategoryMutation = useMutation({
        mutationFn: async ({ text }: { text: string; }) => {
            if (!currentUser) throw new Error("User not authenticated");

            const userId = currentUser.uid;

            try {
                await addDoc(collection(db, "categories"), { 
                    text,
                    userId,
                });
            } catch (error) {
                console.error("Error adding category:", error);
            }

            //toast.success("Category added!");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories", currentUser?.uid] });
        },
        onError: () => {
            //toast.error("Failed to add category. Please try again.");
        },
    });

    // Mutation to update an existing category
    const updateCategoryMutation = useMutation({
        mutationFn: async ({ id, text }: { id: string, text: string; }) => {
            if (!currentUser) throw new Error("User not authenticated");

            try {
                await updateDoc(doc(db, "categories", id), {
                    text: text,
                });
            } catch (error) {
                console.error("Error updating category:", error);
            }

            //toast.success("Category updated!");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories", currentUser?.uid] });
        },
        onError: () => {
            //toast.error("Failed to update category. Please try again.");
        },
    });

    // Mutation to delete an existing category
    const deleteCategoryMutation = useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            if (!currentUser) throw new Error("User not authenticated");

            try {
                await deleteDoc(doc(db, "categories", id));
            } catch (error) {
                console.error("Error deleting category:", error);
            }

            //toast.success("Category removed successfully!");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories", currentUser?.uid] });
        },
        onError: () => {
            //toast.error("Failed to delete category. Please try again.");
        },
    });

    return (
        <CategoriesContext.Provider
            value={{
                isLoadingCategories,
                isUpdatingCategories: addCategoryMutation.isPending || updateCategoryMutation.isPending || deleteCategoryMutation.isPending,
                categories,
                refreshCategories: () => queryClient.invalidateQueries({ queryKey : ["categories", currentUser?.uid]}),
                addCategory: (text) => addCategoryMutation.mutate({text}),
                updateCategory: (id, text) => updateCategoryMutation.mutate({id, text}),
                deleteCategory: (id) => deleteCategoryMutation.mutate({ id })
            }}
        >
            {children}
        </CategoriesContext.Provider>
    )
}

export default CategoriesProvider;

