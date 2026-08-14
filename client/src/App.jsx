import React, {
  useState,
  useEffect,
} from "react";

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
// ===================== PAGES ===========================
// ======================================================

import About from "./pages/About";
import HigherAuthorityDashboard from "./pages/HigherAuthorityDashbaord";
import StaffDashboard from "./pages/StaffDashboard";
import JuniorStaffDashboard from "./pages/JuniorStaffDashboard";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";


// ======================================================
// =================== COMPONENTS ========================
// ======================================================

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ReportsTable from "./components/ReportsTable";
import Departments from "./components/Departments";
import AnalyticsCharts from "./components/AnalyticsCharts";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PasswordReset from "./components/PasswordReset";
import NotFound from "./components/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";


// ======================================================
// ==================== CONTEXT ==========================
// ======================================================

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";


// ======================================================
// ==================== HELPERS ==========================
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
// ====================== LAYOUT =========================
// ======================================================

const Layout = ({
  children,
  isSidebarOpen,
  closeSidebar,
  openSidebar,
}) => {
  const location = useLocation();


  // Pages where Navbar and Sidebar
  // should NOT be displayed
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/about",
    "/404",
  ];


  const isPublicPage =
    publicRoutes.includes(
      location.pathname
    );


  return (
    <div
      className="
        min-h-screen
        bg-white
        text-gray-900
        transition-colors
        duration-300
      "
    >

      {/* ================= SIDEBAR ================= */}

      {!isPublicPage && (
        <Sidebar
          isOpen={isSidebarOpen}
          closeSidebar={closeSidebar}
        />
      )}


      {/* ================= NAVBAR ================= */}

      {!isPublicPage && (
        <Navbar
          onHoverSidebar={openSidebar}
        />
      )}


      {/* ================= PAGE CONTENT ================= */}

      <div
        className={
          !isPublicPage
            ? "pt-20 p-6"
            : ""
        }
      >
        {children}
      </div>

    </div>
  );
};


// ======================================================
// ====================== ROUTES =========================
// ======================================================

const AppRoutes = () => {

  const {
    user,
    loading,
  } = useAuth();


  // ====================================================
  // AUTH LOADING
  // ====================================================

  if (loading) {
    return (
      <div
        className="
          flex
          items-center
          justify-center
          min-h-screen
          text-xl
          font-semibold
        "
      >
        Loading...
      </div>
    );
  }


  // ====================================================
  // DASHBOARD ROUTE
  // ====================================================

  const userDashboardRoute =
    getDashboardRoute(user);


  return (
    <Routes>

      {/* ==================================================
          LANDING PAGE
      ================================================== */}

      <Route
        path="/"
        element={
          <LandingPage />
        }
      />


      {/* ==================================================
          LOGIN
      ================================================== */}

      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : (
            <Navigate
              to={userDashboardRoute}
              replace
            />
          )
        }
      />


      {/* ==================================================
          SIGNUP
      ================================================== */}

      <Route
        path="/signup"
        element={
          !user ? (
            <Signup />
          ) : (
            <Navigate
              to={userDashboardRoute}
              replace
            />
          )
        }
      />


      {/* ==================================================
          FORGOT PASSWORD
      ================================================== */}

      <Route
        path="/forgot-password"
        element={
          !user ? (
            <PasswordReset />
          ) : (
            <Navigate
              to={userDashboardRoute}
              replace
            />
          )
        }
      />


      {/* ==================================================
          ABOUT
      ================================================== */}

      <Route
        path="/about"
        element={
          <About />
        }
      />


      {/* ==================================================
          404 PAGE
      ================================================== */}

      <Route
        path="/404"
        element={
          <NotFound />
        }
      />


      {/* ==================================================
          HIGHER AUTHORITY DASHBOARD
      ================================================== */}

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute
            allowedRoles={[
              "Higher Authority",
            ]}
          >
            <HigherAuthorityDashboard />
          </ProtectedRoute>
        }
      />


      {/* ==================================================
          STAFF DASHBOARD
      ================================================== */}

      <Route
        path="/staff-dashboard"
        element={
          <ProtectedRoute
            allowedRoles={[
              "Staff",
            ]}
          >
            <StaffDashboard />
          </ProtectedRoute>
        }
      />


      {/* ==================================================
          JUNIOR STAFF DASHBOARD
      ================================================== */}

      <Route
        path="/junior-dashboard"
        element={
          <ProtectedRoute
            allowedRoles={[
              "Junior Staff",
            ]}
          >
            <JuniorStaffDashboard />
          </ProtectedRoute>
        }
      />


      {/* ==================================================
          PROFILE
      ================================================== */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />


      {/* ==================================================
          REPORTS
      ================================================== */}

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsTable />
          </ProtectedRoute>
        }
      />


      {/* ==================================================
          DEPARTMENTS
      ================================================== */}

      <Route
        path="/departments"
        element={
          <ProtectedRoute>
            <Departments />
          </ProtectedRoute>
        }
      />


      {/* ==================================================
          ANALYTICS
      ================================================== */}

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsCharts />
          </ProtectedRoute>
        }
      />


      {/* ==================================================
          UNKNOWN URL
      ================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/404"
            replace
          />
        }
      />

    </Routes>
  );
};


// ======================================================
// ======================== APP ==========================
// ======================================================

function App() {

  // ====================================================
  // SIDEBAR STATE
  // ====================================================

  const [
    isSidebarOpen,
    setIsSidebarOpen,
  ] = useState(false);


  // ====================================================
  // DARK MODE STATE
  // ====================================================

  const [
    darkMode,
    setDarkMode,
  ] = useState(() => {

    return (
      localStorage.getItem(
        "theme"
      ) === "dark"
      ||
      (
        !localStorage.getItem(
          "theme"
        )
        &&
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
      )
    );
  });


  // ====================================================
  // APPLY DARK MODE
  // ====================================================

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


  // ====================================================
  // OPEN SIDEBAR
  // ====================================================

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };


  // ====================================================
  // CLOSE SIDEBAR
  // ====================================================

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };


  // ====================================================
  // RENDER APP
  // ====================================================

  return (
    <AuthProvider>

      <Router>

        <Layout
          isSidebarOpen={
            isSidebarOpen
          }
          closeSidebar={
            closeSidebar
          }
          openSidebar={
            openSidebar
          }
        >

          <AppRoutes />

        </Layout>

      </Router>


      {/* Toast Notifications */}

      <ToastContainer />

    </AuthProvider>
  );
}


export default App;