// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  // Redirect unauthenticated users to signup page
  return user ? children : <Navigate to="/signup" replace />;
};

export default ProtectedRoute;
