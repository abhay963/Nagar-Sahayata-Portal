import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    otp: {
      type: String,
      required: [true, "Please add an OTP"],
    },

    expiresAt: {
      type: Date,
      required: true,
      default: () =>
        new Date(Date.now() + 5 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Otp",
  otpSchema
);