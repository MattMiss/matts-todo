import { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { FaBars } from "react-icons/fa";
import { useAuth } from "../context/useAuthContext";

const Navbar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
    const { currentUser } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    const firstName = currentUser?.displayName?.split(" ")[0] || "User";

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
            {/* Navigation Tabs */}
            <div className="flex gap-4">
                <button
                    className={`px-4 py-2 rounded ${activeTab === "list" ? "bg-gray-600" : "hover:bg-gray-700"}`}
                    onClick={() => setActiveTab("list")}
                >
                    My To-Do List
                </button>
            </div>

            {/* User Info and Hamburger Menu */}
            <div className="flex items-center gap-2 relative" ref={menuRef}>
                <div className="flex items-center gap-2">
                    <img
                        src={currentUser?.photoURL || "https://via.placeholder.com/32"}
                        alt={firstName}
                        className="w-8 h-8 rounded-full"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                    />
                    <span className="text-sm">{firstName}</span>
                </div>

                {/* Hamburger Button */}
                <button
                    className="text-white p-2 hover:bg-gray-700 rounded-full focus:outline-none"
                    onClick={() => setMenuOpen((prev) => !prev)}
                >
                    <FaBars size={24} />
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                    <div className="absolute right-0 mt-32 w-48 bg-white text-gray-800 shadow-lg rounded-md">
                        <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
