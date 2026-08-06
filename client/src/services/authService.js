import API from "../api/axios";

// Authentication

export const signup = (data) =>
  API.post("/api/auth/signup", data);

export const completeSignup = (formData) =>
  API.post("/api/auth/complete-signup", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const login = (data) =>
  API.post("/api/auth/login", data);

export const getMe = () =>
  API.get("/api/auth/me");

// OTP

export const sendOtp = (data) =>
  API.post("/api/auth/send-otp", data);

export const verifyOtp = (data) =>
  API.post("/api/auth/verify-otp", data);

// Password

export const forgotPassword = (data) =>
  API.post("/api/auth/forgot-password", data);

export const resetPassword = (data) =>
  API.post("/api/auth/reset-password", data);