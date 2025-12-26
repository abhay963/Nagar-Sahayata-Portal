import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import About from "./pages/About";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ReportsTable from "./components/ReportsTable";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Departments from "./components/Departments";
import AnalyticsCharts from "./components/AnalyticsCharts";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PasswordReset from "./components/PasswordReset";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/" replace />}
      />
      <Route
        path="/signup"
        element={!user ? <Signup /> : <Navigate to="/" replace />}
      />
      <Route
        path="/forgot-password"
        element={!user ? <PasswordReset /> : <Navigate to="/" replace />}
      />
      <Route path="/about" element={<About />} />
      
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
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
    
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300">
          <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
          <Navbar onHoverSidebar={openSidebar} />
          <div className="pt-20 p-6">
            <AppRoutes />
          </div>
        </div>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
