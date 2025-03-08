import { db } from "../../firebase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from "firebase/firestore";
import { useAuth } from "../auth/useAuthContext";
import { TodosContext } from "./todosContext";
import { Todo } from "../../types/types";


const TodosProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth();
    const queryClient = useQueryClient();

    // Fetch todos from firebase
    const fetchTodos = async (): Promise<Todo[]> => {
        if (!currentUser) return [];

        const q = query(collection(db, "todos"), where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));

        return getDocs(q).then((snapshot) => {
            const todos: Todo[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Todo[];

            return todos;
        });
    };

    // Use TanStack Query to manage the fetching and caching
    const { data: todos = [], isLoading: isLoadingTodos } = useQuery({
        queryKey: ["todos", currentUser?.uid],
        queryFn: fetchTodos,
        enabled: !!currentUser, // Fetch only if user is logged in
        staleTime: 1000 * 60 * 5, // 5 minutes cache time
        gcTime: 1000 * 60 * 10, // 10 minutes before removal
    });

    // Mutation to add a new todo
    const addTodoMutation = useMutation({
        mutationFn: async ({ text, categoryId, urgency }: { text: string; categoryId: string | undefined, urgency: number }) => {
            if (!currentUser) throw new Error("User not authenticated");

            const userId = currentUser.uid;

            try {
                await addDoc(collection(db, "todos"), {
                    text,
                    createdAt: Date.now(),
                    userId,
                    categoryId: categoryId || null, // Optional category association
                    urgency,
                    completed: false
                });
            } catch (error) {
                console.error("Error adding todo:", error);
            }

            //toast.success("Todo added!");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", currentUser?.uid] });
        },
        onError: () => {
            //toast.error("Failed to add todo. Please try again.");
        },
    });

    // Mutation to update an existing todo
    const updateTodoMutation = useMutation({
        mutationFn: async ({ id, text, categoryId, urgency }: { id: string, text: string; categoryId: string | undefined, urgency: number }) => {
            if (!currentUser) throw new Error("User not authenticated");

            try {
                await updateDoc(doc(db, "todos", id), {
                    text,
                    categoryId: categoryId || null, 
                    urgency,
                });
            } catch (error) {
                console.error("Error updating todo:", error);
            }

            //toast.success("Todo updated!");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", currentUser?.uid] });
        },
        onError: () => {
            //toast.error("Failed to update todo. Please try again.");
        },
    });

    // Mutation to mark todo as completed or not
    const completeTodoMutation = useMutation({
        mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
            if (!currentUser) throw new Error("User not authenticated");
    
            try {
                await updateDoc(doc(db, "todos", id), {
                    completed
                });
            } catch (error) {
                console.error("Error updating completion status:", error);
            }
    
            //toast.success(completed ? "Todo marked as complete!" : "Todo marked as incomplete!");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", currentUser?.uid] });
        },
        onError: () => {
            //toast.error("Failed to update todo. Please try again.");
        },
    });

    // Mutation to delete an existing todo
    const deleteTodoMutation = useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            if (!currentUser) throw new Error("User not authenticated");

            try {
                await deleteDoc(doc(db, "todos", id));
            } catch (error) {
                console.error("Error deleting todo:", error);
            }

            //toast.success("Todo removed successfully!");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", currentUser?.uid] });
        },
        onError: () => {
            //toast.error("Failed to delete todo. Please try again.");
        },
    });

    return (
        <TodosContext.Provider
            value={{
                isLoadingTodos,
                isUpdatingTodos: addTodoMutation.isPending || updateTodoMutation.isPending || deleteTodoMutation.isPending,
                todos,
                refreshTodos: () => queryClient.invalidateQueries({ queryKey : ["todos", currentUser?.uid]}),
                addTodo: (text, categoryId, urgency) => addTodoMutation.mutate({text, categoryId, urgency}),
                updateTodo: (id, text, categoryId, urgency) => updateTodoMutation.mutate({id, text, categoryId, urgency}),
                completeTodo: (id, completed) => completeTodoMutation.mutate({id, completed}),
                deleteTodo: (id) => deleteTodoMutation.mutate({ id })
            }}
        >
            {children}
        </TodosContext.Provider>
    )
}

export default TodosProvider;

