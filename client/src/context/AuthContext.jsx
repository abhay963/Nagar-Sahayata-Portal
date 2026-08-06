import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../api/axios";

import {
  login,
  signup,
  completeSignup,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getMe,
} from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // ======================================================
  // STATE
  // ======================================================

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // TOKEN HELPER
  // ======================================================

  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
    }
  };

  // ======================================================
  // FETCH CURRENT USER
  // ======================================================

  const fetchUser = async () => {
    try {
      const response = await getMe();

      setUser(response.data.user);
    } catch (error) {
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);
    fetchUser();
  }, []);

  // ======================================================
  // LOGIN
  // ======================================================
const loginUser = async (email, password) => {
  const response = await login({
    email,
    password,
  });

  console.log("LOGIN RESPONSE DATA:", response.data);

  const { token, ...userData } = response.data;

  setAuthToken(token);
  setUser(userData);

  return userData;
};

  // ======================================================
  // SIGNUP
  // ======================================================

  const signupUser = async (email) => {
    return await signup({
      email,
    });
  };

  // ======================================================
  // COMPLETE SIGNUP
  // ======================================================

  const register = async (formData) => {
    const response = await completeSignup(formData);

    const { token, user } = response.data;

    setAuthToken(token);
    setUser(user);

    return user;
  };

  // ======================================================
  // SEND OTP
  // ======================================================

  const sendOtpCode = async (email, type) => {
    return await sendOtp({
      email,
      type,
    });
  };

  // ======================================================
  // VERIFY OTP
  // ======================================================

  const verifyOtpCode = async (email, otp, type) => {
    return await verifyOtp({
      email,
      otp,
      type,
    });
  };

  // ======================================================
  // FORGOT PASSWORD
  // ======================================================

  const sendResetOtp = async (email) => {
    return await forgotPassword({
      email,
    });
  };

  // ======================================================
  // RESET PASSWORD
  // ======================================================

  const updatePassword = async (
    email,
    otp,
    newPassword
  ) => {
    return await resetPassword({
      email,
      otp,
      newPassword,
    });
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setLoading(false);
  };

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value = useMemo(
    () => ({
      user,
      loading,

      login: loginUser,
      signup: signupUser,
      completeSignup: register,

      sendOtp: sendOtpCode,
      verifyOtp: verifyOtpCode,

      forgotPassword: sendResetOtp,
      resetPassword: updatePassword,

      logout,
      fetchUser,
      setUser,
    }),
    [user, loading]
  );

  // ======================================================
  // PROVIDER
  // ======================================================

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;