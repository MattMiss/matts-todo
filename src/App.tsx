import { useState } from "react";
import { useAuth } from "./context/useAuthContext";
import Login from "./components/Login";
import Spinner from "./components/Spinner";
import Navbar from "./components/Navbar";

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
        <div className="min-h-screen bg-gray-100">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="p-4">
                {activeTab === "list" && <p>My To-Do List</p>}
            </div>
        </div>
    );
};

export default App;
