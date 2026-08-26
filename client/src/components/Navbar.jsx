import React, { useMemo } from "react";

import {
  User,
  Menu,
  Info,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import GoogleTranslate from "./GoogleTranslate";

import { useAuth } from "../context/AuthContext";

const Navbar = ({
  onHoverSidebar,
}) => {
  const navigate = useNavigate();

  const { user } = useAuth();

  // ======================================================
  // DASHBOARD ROUTE
  // ======================================================

  const dashboardRoute = useMemo(() => {
    switch (user?.role) {
      case "Higher Authority":
        return "/admin-dashboard";

      case "Staff":
        return "/staff-dashboard";

      case "Junior Staff":
        return "/junior-dashboard";

      case "Citizen":
        return "/citizen-dashboard";

      default:
        return "/";
    }
  }, [user]);

  // ======================================================
  // NAVIGATION
  // ======================================================

  const goToDashboard = () => {
    navigate(dashboardRoute);
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-700 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        <div className="h-16 px-6 flex items-center justify-between">

          {/* ====================================================== */}
          {/* LEFT */}
          {/* ====================================================== */}

          <div className="flex items-center gap-4">

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={onHoverSidebar}
              className="p-3 rounded-2xl hover:bg-white/10 active:bg-white/20 transition-all duration-200 text-white"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-6 h-6" />
            </motion.button>

            <div
              onClick={goToDashboard}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <motion.div
                whileHover={{
                  rotate: 8,
                  scale: 1.05,
                }}
                className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-inner"
              >
                <img
                  src="/government-of-jharkhand.png"
                  alt="Government of Jharkhand"
                  className="w-9 h-9 object-contain"
                />
              </motion.div>

              <div>
                <p className="text-white font-bold text-xl tracking-tighter group-hover:text-emerald-100 transition-colors">
                  Nagar Sahayata
                </p>

                <p className="text-emerald-200 text-xs font-light -mt-1 tracking-wide">
                  GOVERNMENT OF JHARKHAND
                </p>
              </div>
            </div>
          </div>

          {/* ====================================================== */}
          {/* CENTER */}
          {/* ====================================================== */}

          <div className="hidden md:block">
            <motion.h1
              whileHover={{
                scale: 1.02,
              }}
              onClick={goToDashboard}
              className="text-xl font-bold text-white tracking-[4px] uppercase cursor-pointer hover:text-emerald-100 transition-all duration-300 hover:tracking-widest"
            >
              NAGAR SAHAYATA
            </motion.h1>
          </div>

          {/* ====================================================== */}
          {/* RIGHT */}
          {/* ====================================================== */}

          <div className="flex items-center gap-2">

            <motion.button
              whileHover={{
                scale: 1.1,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() =>
                navigate("/profile")
              }
              className="p-3 rounded-2xl hover:bg-white/10 active:bg-white/20 transition-all duration-200 text-white cursor-pointer"
            >
              <User className="w-6 h-6" />
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.1,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() =>
                navigate("/about")
              }
              className="p-3 rounded-2xl hover:bg-white/10 active:bg-white/20 transition-all duration-200 text-white cursor-pointer"
            >
              <Info className="w-6 h-6" />
            </motion.button>

            <div className="pl-3 border-l border-white/20">
              <GoogleTranslate />
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;