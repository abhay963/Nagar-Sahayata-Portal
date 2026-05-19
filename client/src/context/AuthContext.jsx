import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import axios from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/me");
setUser(res.data.user);
    } catch (error) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });

      const { token, redirectUrl, ...userData } = res.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);

      return { ...userData, redirectUrl };
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email) => {
    try {
      const res = await axios.post("/api/auth/signup", { email });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

 const completeSignup = async (formData) => {

  try {

    const res = await axios.post(

      "/api/auth/complete-signup",

      formData
    );

    const {
      token,
      redirectUrl,
      ...userData
    } = res.data;

    localStorage.setItem(
      "token",
      token
    );

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;

    setUser(userData);

    return {
      ...userData,
      redirectUrl,
    };

  } catch (error) {

    throw error;
  }
};

  const sendOtp = async (email, type) => {
    try {
      const res = await axios.post("/api/auth/send-otp", { email, type });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const verifyOtp = async (email, otp, type) => {
    try {
      const res = await axios.post("/api/auth/verify-otp", { email, otp, type });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const res = await axios.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

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

export default AuthContext;