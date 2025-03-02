import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import AuthProvider from './context/auth/AuthProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TodosProvider from './context/todo/TodosProvider.tsx';
import CategoriesProvider from './context/category/CategoriesProvider.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <TodosProvider>
                    <CategoriesProvider>
                        <App />
                    </CategoriesProvider>
                </TodosProvider>
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>,
)
