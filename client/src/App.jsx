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

import Dashboard from "./pages/Dashboard";

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

import ProtectedRoute from "./components/ProtectedRoute";


// ======================================================
// ==================== CONTEXT =========================
// ======================================================

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";



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

  // ======================================================
  // ================= PUBLIC ROUTES ======================
  // ======================================================

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

      {/* ====================================================== */}
      {/* =============== SHOW ONLY AFTER LOGIN ================= */}
      {/* ====================================================== */}

      {
        !isPublicPage && (
          <Sidebar
            isOpen={isSidebarOpen}
            closeSidebar={closeSidebar}
          />
        )
      }

      {
        !isPublicPage && (
          <Navbar
            onHoverSidebar={openSidebar}
          />
        )
      }

      {/* ====================================================== */}
      {/* ================= MAIN CONTENT ======================= */}
      {/* ====================================================== */}

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

  // ======================================================
  // =================== LOADING ==========================
  // ======================================================

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

  return (

    <Routes>

      {/* ====================================================== */}
      {/* ================= LANDING PAGE ======================= */}
      {/* ====================================================== */}

      <Route
        path="/"
        element={<LandingPage />}
      />



      {/* ====================================================== */}
      {/* ================= PUBLIC ROUTES ====================== */}
      {/* ====================================================== */}

      <Route
        path="/login"
        element={
          !user
            ? <Login />
            : <Navigate to="/dashboard" replace />
        }
      />

      <Route
        path="/signup"
        element={
          !user
            ? <Signup />
            : <Navigate to="/dashboard" replace />
        }
      />

      <Route
        path="/forgot-password"
        element={
          !user
            ? <PasswordReset />
            : <Navigate to="/dashboard" replace />
        }
      />

      <Route
        path="/about"
        element={<About />}
      />



      {/* ====================================================== */}
      {/* ================= DASHBOARD ========================== */}
      {/* ====================================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />



      {/* ====================================================== */}
      {/* ================= PROFILE ============================ */}
      {/* ====================================================== */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />



      {/* ====================================================== */}
      {/* ================= REPORTS ============================ */}
      {/* ====================================================== */}

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsTable />
          </ProtectedRoute>
        }
      />



      {/* ====================================================== */}
      {/* ================= DEPARTMENTS ======================== */}
      {/* ====================================================== */}

      <Route
        path="/departments"
        element={
          <ProtectedRoute>
            <Departments />
          </ProtectedRoute>
        }
      />



      {/* ====================================================== */}
      {/* ================= ANALYTICS ========================== */}
      {/* ====================================================== */}

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsCharts />
          </ProtectedRoute>
        }
      />



      {/* ====================================================== */}
      {/* ================== INVALID ROUTES ==================== */}
      {/* ====================================================== */}

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

  // ======================================================
  // ================= SIDEBAR STATE ======================
  // ======================================================

  const [
    isSidebarOpen,
    setIsSidebarOpen
  ] = useState(false);



  // ======================================================
  // ================== DARK MODE =========================
  // ======================================================

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



  // ======================================================
  // ================= APPLY THEME ========================
  // ======================================================

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



  // ======================================================
  // ================= SIDEBAR FUNCTIONS ==================
  // ======================================================

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };



  // ======================================================
  // ======================= UI ===========================
  // ======================================================

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

      {/* ====================================================== */}
      {/* ================= TOAST NOTIFICATIONS ================ */}
      {/* ====================================================== */}

      <ToastContainer />

    </AuthProvider>
  );
}

export default App;