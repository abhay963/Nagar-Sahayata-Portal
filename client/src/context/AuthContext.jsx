import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

// Create Context
const AuthContext = createContext();

// Custom hook for using Auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/me");
      setUser(res.data);
    } catch (error) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
    setLoading(false);
  };

  // Load user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      const { token, redirectUrl, ...userData } = res.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);
      return { ...userData, redirectUrl };
    } catch (error) {
      throw error;
    }
  };

  // Signup
  const signup = async (email) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        email,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // Complete Signup
  const completeSignup = async (
    name,
    email,
    password,
    role,
    department,
    contact,
    empId,
    address,
    otp
  ) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/complete-signup", {
        name,
        email,
        password,
        role,
        department,
        contact,
        empId,
        address,
        otp,
      });
      const { token, redirectUrl, ...userData } = res.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);
      return { ...userData, redirectUrl };
    } catch (error) {
      throw error;
    }
  };

  // Send OTP
  const sendOtp = async (email, type) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email,
        type,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // Verify OTP
  const verifyOtp = async (email, otp, type) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
        type,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // Reset Password
  const resetPassword = async (email, otp, newPassword) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        completeSignup,
        sendOtp,
        verifyOtp,
        forgotPassword,
        resetPassword,
        logout,
        setUser,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ✅ Default export for raw context
export default AuthContext;
