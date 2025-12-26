import React from "react";
import {
  LayoutDashboard,
  FileText,
  ListChecks,
  Building,
  BarChart3,
  Settings,
  X,
  Info, // Import the Info icon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Make sure this path is correct

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Get the current user from AuthContext

  // 🔐 Only render sidebar if user is logged in
  if (!user) return null;

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Reports", icon: FileText, path: "/reports" },
    { name: "Departments", icon: Building, path: "/departments" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "About", icon: Info, path: "/about" }, // Add About item
  ];

  const handleNavigation = (path) => {
    navigate(path);
    closeSidebar(); // Optional: auto-close sidebar after navigation
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white text-black shadow-lg w-64 transform transition-transform duration-300 z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      onMouseLeave={closeSidebar}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-black">Staff Panel</h1>
<button
  onClick={closeSidebar}
  className="text-black hover:bg-gray-200 rounded p-1 cursor-pointer"
  aria-label="Close sidebar"
>
  <X className="w-5 h-5" />
</button>
      </div>

      <nav className="flex-1 mt-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="group flex items-center px-4 py-2 text-black hover:bg-green-100 cursor-pointer transition"
              onClick={() => handleNavigation(item.path)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleNavigation(item.path);
                }
              }}
            >
              <item.icon className="w-5 h-5 text-black" />
              <span className="ml-3">{item.name}</span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
