import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { AuthContext } from "./authContext";
import { auth } from "../firebase";
import Spinner from "../components/Spinner";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthorizing, setIsAuthorizing] = useState<boolean>(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            setCurrentUser(user);
        } else {
            setCurrentUser(null);
        }
  
        setIsAuthorizing(false);
      });
  
      return () => unsubscribe();
    }, []);
  
    if (isAuthorizing) {
      return <Spinner />; 
    }
  
    return (
        <AuthContext.Provider value={{ currentUser, isAuthorizing }}>
            {children}
        </AuthContext.Provider>
    );
  };
  

export default AuthProvider;