import { createContext } from "react";
import { User } from "firebase/auth";

interface AuthContextType {
    currentUser: User | null;
    isAuthorizing: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    isAuthorizing: true,
});