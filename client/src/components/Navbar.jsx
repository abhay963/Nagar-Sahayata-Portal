import React, { useState, useEffect, useContext } from "react";
import { Bell, User, Menu, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GoogleTranslate from "./GoogleTranslate";
import axios from "../api/axios";
import NotificationsPanel from "./NotificationsPanel";
import AuthContext from "../context/AuthContext";

const Navbar = ({ onHoverSidebar }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (!currentUser) return;

      try {
        if (currentUser.role === "Junior Staff") {
          // Fetch count of assigned reports for Junior Staff
          const res = await axios.get("/api/reports/assigned");
          setNotificationCount(res.data.length || 0);
        } else {
          // Fetch normal unread notifications count for others
          const res = await axios.get("/api/notifications/unread-count");
          setNotificationCount(res.data.count || 0);
        }
      } catch (error) {
        console.error("Failed to fetch notification count", error);
      }
    };

    fetchNotificationCount();
  }, [currentUser]);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-700 to-green-500 shadow-md border-b text-white z-50 flex items-center px-6"
      style={{ height: "56px" }}
    >
      {/* Left section: sidebar toggle + logo */}
      <div className="flex items-center space-x-3 w-1/4 h-full">
        <button
          onMouseEnter={onHoverSidebar}
          className="p-2 rounded hover:bg-green-600 transition flex items-center justify-center cursor-pointer"
          aria-label="Toggle sidebar"
          style={{ height: "36px", width: "36px" }}
        >
          <Menu className="w-6 h-6 transition-transform duration-200 hover:scale-110" />
        </button>

        <div
          className="flex flex-col items-center cursor-pointer justify-center"
          onClick={() => navigate("/dashboard")}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Jharkhand_Rajakiya_Chihna.svg/1200px-Jharkhand_Rajakiya_Chihna.svg.png"
            alt="Government of Jharkhand Logo"
            className="w-8 h-8 object-contain mb-0.5"
          />
          <p className="text-xs font-light select-none leading-none">
            Government of Jharkhand
          </p>
        </div>
      </div>

      {/* Center section: Title */}
      <div className="flex justify-center flex-1 h-full items-center">
        <h1
          className="text-lg font-bold uppercase tracking-widest cursor-pointer select-none"
          aria-label="Nagar Sahayata Portal"
          onClick={() => navigate("/dashboard")}
          title="Go to Dashboard"
        >
          Nagar Sahayata Portal
        </h1>
      </div>

      {/* Right section: Notifications, Profile, Language, About */}
      <div className="flex items-center space-x-5 w-1/4 justify-end h-full relative">
        {/* Bell */}
        <div
          className="relative flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
          style={{ height: "36px", width: "36px" }}
          onClick={toggleNotifications}
        >
          <Bell className="w-6 h-6" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {notificationCount}
            </span>
          )}
        </div>

        {/* User */}
        <div
          className="relative flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
          style={{ height: "36px", width: "36px" }}
          onClick={() => navigate("/profile")}
        >
          <User className="w-7 h-7" />
        </div>

        {/* About */}
        <div
          className="relative flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
          style={{ height: "36px", width: "36px" }}
          onClick={() => navigate("/about")}
          title="About This Platform"
          aria-label="About"
        >
          <Info className="w-6 h-6" />
        </div>

        {/* 🌐 Google Translate */}
        <GoogleTranslate />

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="absolute top-full right-0 mt-2 w-80 z-50">
            <NotificationsPanel />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
