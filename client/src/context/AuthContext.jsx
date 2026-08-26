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

      api.defaults.headers.common.Authorization =
        `Bearer ${token}`;
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

      const currentUser = response.data.user;

      setUser(currentUser);

      return currentUser;
    } catch (error) {
      console.error(
        "FETCH USER ERROR:",
        error
      );

      setAuthToken(null);
      setUser(null);

      return null;
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

  const loginUser = async (
    email,
    password
  ) => {
    const response = await login({
      email,
      password,
    });

    console.log(
      "LOGIN RESPONSE DATA:",
      response.data
    );

    /*
      Backend login response is:

      {
        success: true,
        _id,
        name,
        email,
        role,
        department,
        city,
        ...
        token
      }

      Therefore remove token and keep
      everything else as userData.
    */

    const {
      token,
      ...userData
    } = response.data;

    // Save JWT
    setAuthToken(token);

    // Save authenticated user
    setUser(userData);

    console.log(
      "LOGIN USER:",
      userData
    );

    return userData;
  };

  // ======================================================
  // SIGNUP - SEND OTP
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
    const response =
      await completeSignup(formData);

    console.log(
      "COMPLETE SIGNUP RESPONSE:",
      response.data
    );

    /*
      IMPORTANT:

      Backend returns:

      {
        success: true,
        _id: "...",
        name: "...",
        email: "...",
        role: "...",
        ...
        token: "..."
      }

      It does NOT return:

      {
        token: "...",
        user: {...}
      }

      So we must handle it exactly like login.
    */

    const {
      token,
      ...userData
    } = response.data;

    // ==================================================
    // SAVE TOKEN
    // ==================================================

    setAuthToken(token);

    // ==================================================
    // SAVE USER
    // ==================================================

    setUser(userData);

    console.log(
      "REGISTERED USER:",
      userData
    );

    console.log(
      "REGISTERED ROLE:",
      userData.role
    );

    return userData;
  };

  // ======================================================
  // SEND OTP
  // ======================================================

  const sendOtpCode = async (
    email,
    type
  ) => {
    return await sendOtp({
      email,
      type,
    });
  };

  // ======================================================
  // VERIFY OTP
  // ======================================================

  const verifyOtpCode = async (
    email,
    otp,
    type
  ) => {
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

      // Authentication
      login: loginUser,
      signup: signupUser,
      completeSignup: register,

      // OTP
      sendOtp: sendOtpCode,
      verifyOtp: verifyOtpCode,

      // Password
      forgotPassword: sendResetOtp,
      resetPassword: updatePassword,

      // Logout
      logout,

      // User
      fetchUser,
      setUser,
    }),
    [
      user,
      loading,
    ]
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