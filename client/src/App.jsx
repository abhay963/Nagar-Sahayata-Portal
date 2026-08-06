import React, { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// ======================================================
// ===================== PAGES ==========================
// ======================================================

import About from "./pages/About";
import HigherAuthorityDashboard from "./pages/HigherAuthorityDashbaord";
import StaffDashboard from "./pages/StaffDashboard";
import JuniorStaffDashboard from "./pages/JuniorStaffDashboard";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";

// ======================================================
// =================== COMPONENTS =======================
// ======================================================

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ReportsTable from "./components/ReportsTable";
import Departments from "./components/Departments";
import AnalyticsCharts from "./components/AnalyticsCharts";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PasswordReset from "./components/PasswordReset";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// ======================================================
// ==================== CONTEXT =========================
// ======================================================

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

// ======================================================
// ==================== HELPERS =========================
// ======================================================

const getDashboardRoute = (user) => {
  switch (user?.role) {
    case "Higher Authority":
      return "/admin-dashboard";
    case "Staff":
      return "/staff-dashboard";
    case "Junior Staff":
      return "/junior-dashboard";
    default:
      return "/";
  }
};

// ======================================================
// ====================== LAYOUT ========================
// ======================================================

const Layout = ({
  children,
  isSidebarOpen,
  closeSidebar,
  openSidebar,
}) => {
  const location = useLocation();

  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/about",
  ];

  const isPublicPage =
    publicRoutes.includes(location.pathname);

  return (
    <div className="
      min-h-screen
      bg-white
      text-gray-900
      transition-colors
      duration-300
    ">
      {!isPublicPage && (
        <Sidebar
          isOpen={isSidebarOpen}
          closeSidebar={closeSidebar}
        />
      )}

      {!isPublicPage && (
        <Navbar
          onHoverSidebar={openSidebar}
        />
      )}

      <div className={
        !isPublicPage
          ? "pt-20 p-6"
          : ""
      }>
        {children}
      </div>
    </div>
  );
};

// ======================================================
// ===================== ROUTES =========================
// ======================================================

const AppRoutes = () => {
  const {
    user,
    loading
  } = useAuth();

  if (loading) {
    return (
      <div className="
        flex
        items-center
        justify-center
        min-h-screen
        text-xl
        font-semibold
      ">
        Loading...
      </div>
    );
  }

  const userDashboardRoute = getDashboardRoute(user);

  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={
          !user
            ? <Login />
            : <Navigate to={userDashboardRoute} replace />
        }
      />

      <Route
        path="/signup"
        element={
          !user
            ? <Signup />
            : <Navigate to={userDashboardRoute} replace />
        }
      />

      <Route
        path="/forgot-password"
        element={
          !user
            ? <PasswordReset />
            : <Navigate to={userDashboardRoute} replace />
        }
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["Higher Authority"]}>
            <HigherAuthorityDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff-dashboard"
        element={
          <ProtectedRoute allowedRoles={["Staff"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/junior-dashboard"
        element={
          <ProtectedRoute allowedRoles={["Junior Staff"]}>
            <JuniorStaffDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsTable />
          </ProtectedRoute>
        }
      />

      <Route
        path="/departments"
        element={
          <ProtectedRoute>
            <Departments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsCharts />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate to="/" replace />
        }
      />
    </Routes>
  );
};

// ======================================================
// ======================= APP ==========================
// ======================================================

function App() {
  const [
    isSidebarOpen,
    setIsSidebarOpen
  ] = useState(false);

  const [darkMode, setDarkMode] =
    useState(() => {
      return (
        localStorage.getItem("theme") === "dark" ||
        (
          !localStorage.getItem("theme") &&
          window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches
        )
      );
    });

  useEffect(() => {
    const root =
      document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      root.classList.remove("dark");
      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }, [darkMode]);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <AuthProvider>
      <Router>
        <Layout
          isSidebarOpen={isSidebarOpen}
          closeSidebar={closeSidebar}
          openSidebar={openSidebar}
        >
          <AppRoutes />
        </Layout>
      </Router>

      <ToastContainer />
    </AuthProvider>
  );
}

export default App;