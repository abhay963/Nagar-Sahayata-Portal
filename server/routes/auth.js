// ================= IMPORTS =================

import express from "express";

import upload from "../middleware/upload.js";

import {
  signup,
  completeSignup,
  login,
  getMe,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";


// ================= ROUTER =================

const router = express.Router();


// ================= AUTH ROUTES =================

// User signup
router.post(
  "/signup",
  signup
);


// Complete signup with profile image upload
router.post(

  "/complete-signup",

  upload.single("profileImage"),

  completeSignup
);


// Login
router.post(
  "/login",
  login
);


// Get current logged-in user
router.get(

  "/me",

  protect,

  getMe
);


// Send OTP
router.post(
  "/send-otp",
  sendOtp
);


// Verify OTP
router.post(
  "/verify-otp",
  verifyOtp
);


// Forgot password
router.post(
  "/forgot-password",
  forgotPassword
);


// Reset password
router.post(
  "/reset-password",
  resetPassword
);


// ================= EXPORT =================

export default router;