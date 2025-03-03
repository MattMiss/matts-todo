import { useState } from "react";
import { useAuth } from "./context/auth/useAuthContext";
import Login from "./components/Login";
import Spinner from "./components/Spinner";
import Navbar from "./components/Navbar";
import ToDoList from "./components/ToDoList";

const App = () => {
    const { currentUser, isAuthorizing } = useAuth();
    const [activeTab, setActiveTab] = useState("list");

    if (isAuthorizing) {
        return <Spinner />;
    }

    if (!currentUser) {
        return <Login />;
    }

    return (
        <div className="min-h-screen bg-gray-700">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="p-4">
                {activeTab === "list" && <ToDoList />}
            </div>
        </div>
    );
};

export default App;
