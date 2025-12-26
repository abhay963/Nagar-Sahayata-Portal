import express from "express";
import { sendOtp, verifyOtp } from "../controllers/authController.js";

const router = express.Router();

// @desc    Send OTP
// @route   POST /api/otp/send-otp
// @access  Public
router.post("/send-otp", sendOtp);

// @desc    Verify OTP
// @route   POST /api/otp/verify-otp
// @access  Public
router.post("/verify-otp", verifyOtp);

export default router;
