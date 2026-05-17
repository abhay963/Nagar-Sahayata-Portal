// Import mongoose for MongoDB schema/model
import mongoose from "mongoose";


// ================= OTP SCHEMA =================

// Create OTP schema
const otpSchema = new mongoose.Schema(

  {

    // User email for OTP verification
    email: {

      // Data type
      type: String,

      // Email is required
      required: [true, "Please add an email"],

      // Only one OTP record per email
      unique: true,
    },


    // OTP code
    // Example: 483921
    otp: {

      type: String,

      // OTP required
      required: [true, "Please add an OTP"],
    },


    // OTP expiry time
    expiresAt: {

      type: Date,

      // Expiry required
      required: true,

      // Default expiry = current time + 5 minutes
      default: () =>
        new Date(Date.now() + 5 * 60 * 1000),
    },

  },


  // Automatically adds:
  // createdAt
  // updatedAt
  {
    timestamps: true,
  }
);


// ================= OPTIONAL TTL INDEX =================

// This index automatically deletes expired OTPs
// Currently disabled for debugging purposes

/*
otpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);
*/


// ================= EXPORT MODEL =================

// Create and export Otp model
export default mongoose.model(
  "Otp",
  otpSchema
);