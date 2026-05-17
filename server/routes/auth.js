// Import express framework
import express from "express";

// Import all authentication controller functions
import {
  signup,            // Start signup process
  completeSignup,    // Complete signup after OTP verification
  login,             // User login
  getMe,             // Get logged-in user details
  sendOtp,           // Send OTP to email/phone
  verifyOtp,         // Verify entered OTP
  forgotPassword,    // Send password reset link/OTP
  resetPassword      // Reset new password
} from "../controllers/authController.js";

// Import authentication middleware
// protect middleware checks JWT token
import { protect } from "../middleware/authMiddleware.js";

// Create express router
const router = express.Router();


// ================= AUTH ROUTES =================

// User signup route
// POST -> /api/auth/signup
router.post("/signup", signup);

// Complete signup after OTP verification
// POST -> /api/auth/complete-signup
router.post("/complete-signup", completeSignup);

// User login route
// POST -> /api/auth/login
router.post("/login", login);

// Get current logged-in user details
// Protected route -> requires valid JWT token
// GET -> /api/auth/me
router.get("/me", protect, getMe);

// Send OTP route
// POST -> /api/auth/send-otp
router.post("/send-otp", sendOtp);

// Verify OTP route
// POST -> /api/auth/verify-otp
router.post("/verify-otp", verifyOtp);

// Forgot password route
// Sends reset OTP/link
// POST -> /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// Reset password route
// POST -> /api/auth/reset-password
router.post("/reset-password", resetPassword);


// Export router
export default router;