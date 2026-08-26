import API from "../api/axios";

// =====================================================
// Authentication
// =====================================================

export const signup = (data) =>
  API.post("/auth/signup", data);

export const completeSignup = (formData) =>
  API.post("/auth/complete-signup", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const login = (data) =>
  API.post("/auth/login", data);

export const getMe = () =>
  API.get("/auth/me");

// =====================================================
// OTP
// =====================================================

export const sendOtp = (data) =>
  API.post("/auth/send-otp", data);

export const verifyOtp = (data) =>
  API.post("/auth/verify-otp", data);

// =====================================================
// Password
// =====================================================

export const forgotPassword = (data) =>
  API.post("/auth/forgot-password", data);

export const resetPassword = (data) =>
  API.post("/auth/reset-password", data);