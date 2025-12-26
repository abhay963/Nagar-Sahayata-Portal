import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
  },
  otp: {
    type: String,
    required: [true, "Please add an OTP"],
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
  },
}, { timestamps: true });

// Index to auto-delete expired OTPs (disabled for debugging)

export default mongoose.model("Otp", otpSchema);
