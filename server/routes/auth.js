import express from "express";
import { signup, completeSignup, login, getMe, sendOtp, verifyOtp, forgotPassword, resetPassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/complete-signup", completeSignup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
