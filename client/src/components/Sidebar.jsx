import React, { useMemo } from "react";

import {
  LayoutDashboard,
  FileText,
  Building,
  BarChart3,
  ListChecks,
  ClipboardCheck,
  Info,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Sidebar = ({
  isOpen,
  closeSidebar,
}) => {
  const navigate = useNavigate();

  const { user } = useAuth();

  // ======================================================
  // NOT LOGGED IN
  // ======================================================

  if (!user) {
    return null;
  }

  // ======================================================
  // ROLE BASED MENU
  // ======================================================

  const menuItems = useMemo(() => {
    switch (user.role) {
      // ============================================
      // HIGHER AUTHORITY
      // ============================================

      case "Higher Authority":
        return [
          {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/admin-dashboard",
          },
          {
            name: "Reports",
            icon: FileText,
            path: "/reports",
          },
          {
            name: "Departments",
            icon: Building,
            path: "/departments",
          },
          {
            name: "Analytics",
            icon: BarChart3,
            path: "/analytics",
          },
          {
            name: "About",
            icon: Info,
            path: "/about",
          },
        ];

      // ============================================
      // STAFF
      // ============================================

      case "Staff":
        return [
          {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/staff-dashboard",
          },
          {
            name: "Reports",
            icon: FileText,
            path: "/reports",
          },
          {
            name: "Departments",
            icon: Building,
            path: "/departments",
          },
          {
            name: "About",
            icon: Info,
            path: "/about",
          },
        ];

      // ============================================
      // JUNIOR STAFF
      // ============================================

      case "Junior Staff":
        return [
          {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/junior-dashboard",
          },
          {
            name: "My Tasks",
            icon: ListChecks,
            path: "/reports",
          },
          {
            name: "Task Updates",
            icon: ClipboardCheck,
            path: "/departments",
          },
          {
            name: "About",
            icon: Info,
            path: "/about",
          },
        ];

      // ============================================
      // DEFAULT
      // ============================================

      default:
        return [];
    }
  }, [user.role]);

  // ======================================================
  // NAVIGATION
  // ======================================================

  const handleNavigation = (
    path
  ) => {
    navigate(path);

    closeSidebar();
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-lg z-40 transform transition-transform duration-300 ${
        isOpen
          ? "translate-x-0"
          : "-translate-x-full"
      }`}
      onMouseLeave={closeSidebar}
    >
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold">
          {user.role}
        </h1>

        <button
          onClick={closeSidebar}
          className="rounded p-1 hover:bg-gray-200 cursor-pointer"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ====================================================== */}
      {/* MENU */}
      {/* ====================================================== */}

      <nav className="mt-4">
        <ul className="space-y-2">
          {menuItems.map(
            (item) => (
              <li
                key={item.name}
                className="group flex items-center px-4 py-3 hover:bg-green-100 cursor-pointer transition-colors"
                onClick={() =>
                  handleNavigation(
                    item.path
                  )
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (
                    e.key ===
                      "Enter" ||
                    e.key === " "
                  ) {
                    handleNavigation(
                      item.path
                    );
                  }
                }}
              >
                <item.icon className="w-5 h-5" />

                <span className="ml-3">
                  {item.name}
                </span>
              </li>
            )
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;