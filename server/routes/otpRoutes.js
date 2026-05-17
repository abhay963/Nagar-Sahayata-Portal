// Import express framework
import express from "express";

// Import OTP controller functions
import { sendOtp, verifyOtp } from "../controllers/authController.js";

// Create router object
const router = express.Router();


// ================= OTP ROUTES =================


// Send OTP route
// Used during signup/login/password reset
//
// POST -> /api/otp/send-otp
//
// Access -> Public
router.post("/send-otp", sendOtp);


// Verify OTP route
// Checks whether entered OTP is correct or not
//
// POST -> /api/otp/verify-otp
//
// Access -> Public
router.post("/verify-otp", verifyOtp);


// Export router
export default router;