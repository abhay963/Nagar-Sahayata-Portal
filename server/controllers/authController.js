// Import bcrypt for password hashing
import bcrypt from "bcryptjs";

// Import JWT for token generation
import jwt from "jsonwebtoken";

// Import nodemailer for sending emails
import nodemailer from "nodemailer";

// Import User model
import User from "../models/User.js";

// Import OTP model
import Otp from "../models/Otp.js";


// ================= GENERATE JWT TOKEN =================

// Create JWT token for authentication
const generateToken = (id) => {

  return jwt.sign(

    // Payload data
    { id },

    // Secret key from .env
    process.env.JWT_SECRET,

    // Token expiry time
    {
      expiresIn: "1h",
    }
  );
};



// ======================================================
// ====================== SIGNUP =========================
// ======================================================


// @desc    Initiate signup - Send OTP
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {

  // Get email from request body
  const { email } = req.body;


  // Check email exists
  if (!email) {

    return res.status(400).json({

      success: false,

      message: "Email is required",
    });
  }

  try {

    // Set request type as signup
    req.body.type = "signup";

    // Call sendOtp function
    await sendOtp(req, res);

  } catch (error) {

    console.error("❌ Signup Error:", error);

    res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};



// ======================================================
// ================= COMPLETE SIGNUP ====================
// ======================================================


// @desc    Complete signup after OTP verification
// @route   POST /api/auth/complete-signup
// @access  Public
export const completeSignup = async (req, res) => {

  // Get all user data
  let {

    name,
    email,
    password,
    role,
    department,
    contact,
    empId,
    address,
    otp,

  } = req.body;


  // Remove extra spaces from role
  role = role.trim();

  console.log("Signup role:", role);


  // ================= VALIDATION =================

  if (

    !name ||
    !email ||
    !password ||
    !role ||
    !contact ||
    !empId ||
    !address ||
    !otp ||

    // Department required except Higher Authority
    (role !== "Higher Authority" && !department)

  ) {

    return res.status(400).json({

      success: false,

      message: "All fields are required",
    });
  }

  try {

    // Convert email to lowercase
    const lowerEmail = email.toLowerCase();


    // ================= VERIFY OTP =================

    // Find matching OTP
    const otpRecord = await Otp.findOne({

      email: lowerEmail,

      otp: otp.trim(),
    });


    // Invalid OTP
    if (!otpRecord) {

      return res.status(400).json({

        success: false,

        message: "Invalid OTP",
      });
    }


    // Check OTP expiry
    if (otpRecord.expiresAt < new Date()) {

      // Delete expired OTP
      await Otp.deleteOne({
        _id: otpRecord._id
      });

      return res.status(400).json({

        success: false,

        message: "OTP expired",
      });
    }


    // ================= CHECK EXISTING USER =================

    // Check email already exists
    const emailExists = await User.findOne({
      email: lowerEmail
    });

    if (emailExists) {

      return res.status(400).json({

        success: false,

        message: "Email already registered",
      });
    }


    // Check employee ID exists
    const empIdExists = await User.findOne({
      empId
    });

    if (empIdExists) {

      return res.status(400).json({

        success: false,

        message: "Employee ID already registered",
      });
    }


    // ================= HASH PASSWORD =================

    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );


    // ================= CREATE USER =================

    const user = await User.create({

      name,

      email: lowerEmail,

      password: hashedPassword,

      role,

      department,

      contact,

      empId,

      address,
    });


    // Delete OTP after successful signup
    await Otp.deleteOne({
      _id: otpRecord._id
    });


    // Generate JWT token
    const token = generateToken(user._id);


    // ================= RESPONSE =================

    res.status(201).json({

      success: true,

      _id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      department: user.department,

      contact: user.contact,

      empId: user.empId,

      address: user.address,

      profileImage: user.profileImage,

      joiningDate: user.joiningDate,

      token,

      redirectUrl: "/",
    });

  } catch (error) {

    console.error("❌ Complete Signup Error:", error);

    res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};



// ======================================================
// ======================== LOGIN =======================
// ======================================================


// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {

  // Get email & password
  const { email, password } = req.body;

  try {

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase()
    });


    // Compare password
    if (

      user &&

      (await bcrypt.compare(
        password,
        user.password
      ))

    ) {

      // Generate JWT token
      const token = generateToken(user._id);


      // Default redirect
      let redirectUrl = "/staff-dashboard";


      // Higher authority redirect
      if (user.role === "Higher Authority") {

        redirectUrl = "/admin-dashboard";
      }


      // Success response
      res.json({

        success: true,

        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        department: user.department,

        contact: user.contact,

        empId: user.empId,

        address: user.address,

        profileImage: user.profileImage,

        joiningDate: user.joiningDate,

        token,

        redirectUrl,
      });

    } else {

      // Invalid credentials
      res.status(401).json({

        success: false,

        message: "Invalid email or password",
      });
    }

  } catch (error) {

    console.error("❌ Login Error:", error);

    res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};



// ======================================================
// ======================= GET ME =======================
// ======================================================


// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {

  try {

    // Find logged-in user
    const user = await User.findById(
      req.user.id
    ).select("-password");


    // User not found
    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",
      });
    }


    // Send user data
    res.json({

      success: true,

      user,
    });

  } catch (error) {

    console.error("❌ GetMe Error:", error);

    res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};



// ======================================================
// ===================== SEND OTP =======================
// ======================================================


// @desc    Send OTP
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOtp = async (req, res) => {

  // Get email & request type
  const { email, type } = req.body;


  // Validate email
  if (!email) {

    return res.status(400).json({

      success: false,

      message: "Email is required",
    });
  }


  // Convert email to lowercase
  const lowerEmail = email
    .toLowerCase()
    .trim();

  try {

    // ================= SIGNUP CHECK =================

    // During signup email should NOT exist
    if (type === "signup") {

      const existingUser =
        await User.findOne({
          email: lowerEmail
        });

      if (existingUser) {

        return res.status(400).json({

          success: false,

          message: "Email already registered",
        });
      }
    }


    // ================= RESET CHECK =================

    // During password reset email MUST exist
    if (type === "reset") {

      const existingUser =
        await User.findOne({
          email: lowerEmail
        });

      if (!existingUser) {

        return res.status(400).json({

          success: false,

          message: "Email not registered",
        });
      }
    }


    // ================= DELETE OLD OTP =================

    await Otp.deleteMany({
      email: lowerEmail
    });


    // ================= GENERATE OTP =================

    const otp = generateOTP();


    // Save OTP in database
    await Otp.create({

      email: lowerEmail,

      otp,
    });


    // ================= SEND EMAIL =================

    const transporter = createTransporter();

   const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: type === "signup" 
    ? "Verify Your Email - OTP" 
    : "Reset Your Password - OTP",

  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: 'Segoe UI', Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f7fa; padding: 40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" max-width="500px" cellspacing="0" cellpadding="0" style="max-width: 500px; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #6366f1, #4f46e5); padding: 40px 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
                    ${type === "signup" ? "Email Verification" : "Password Reset"}
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 50px 40px 40px; text-align: center;">
                  <p style="font-size: 17px; color: #374151; margin: 0 0 30px 0; line-height: 1.6;">
                    Enter the OTP below to ${type === "signup" ? "verify your email address" : "reset your password"}.
                  </p>

                  <!-- OTP Box -->
                  <div style="background-color: #f8fafc; border: 2px dashed #6366f1; border-radius: 12px; padding: 25px; margin: 30px 0;">
                    <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; font-weight: 500; letter-spacing: 1px;">
                      YOUR ONE-TIME PASSWORD
                    </p>
                    <h2 style="margin: 0; font-size: 42px; font-weight: 700; color: #1e2937; letter-spacing: 8px;">
                      ${otp}
                    </h2>
                  </div>

                  <p style="color: #ef4444; font-size: 15px; margin: 20px 0 30px 0;">
                    This OTP will expire in <strong>5 minutes</strong>.
                  </p>

                  <div style="background-color: #fefce8; border-left: 4px solid #eab308; padding: 15px 20px; text-align: left; border-radius: 6px; margin: 30px 0;">
                    <p style="margin: 0; color: #854d0e; font-size: 14px;">
                      <strong>Security Tip:</strong> Never share this OTP with anyone. Our team will never ask for it.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">
                    If you didn't request this code, please ignore this email.
                  </p>
                  <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                    © ${new Date().getFullYear()} All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `
};


    // Send email
    await transporter.sendMail(mailOptions);


    // Success response
    res.status(200).json({

      success: true,

      message: "OTP sent successfully",
    });

  } catch (error) {

    console.error("❌ Send OTP Error:", error);

    res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};


// Generate random 6-digit OTP
const generateOTP = () => {

  return Math.floor(

    100000 +

    Math.random() * 900000

  ).toString();
};



// ======================================================
// ==================== VERIFY OTP ======================
// ======================================================


// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {

  // Get email & otp
  const { email, otp } = req.body;


  // Validate fields
  if (!email || !otp) {

    return res.status(400).json({

      success: false,

      message: "Email and OTP are required",
    });
  }

  try {

    // Convert email to lowercase
    const lowerEmail = email
      .toLowerCase()
      .trim();


    // Find matching OTP
    const otpRecord = await Otp.findOne({

      email: lowerEmail,

      otp: otp.trim(),
    });


    // Invalid OTP
    if (!otpRecord) {

      return res.status(400).json({

        success: false,

        message: "Invalid OTP",
      });
    }


    // OTP expired
    if (otpRecord.expiresAt < new Date()) {

      await Otp.deleteOne({
        _id: otpRecord._id
      });

      return res.status(400).json({

        success: false,

        message: "OTP expired",
      });
    }


    // Success response
    res.status(200).json({

      success: true,

      message: "OTP verified successfully",
    });

  } catch (error) {

    console.error("❌ Verify OTP Error:", error);

    res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};



// ======================================================
// ================= EMAIL TRANSPORTER ==================
// ======================================================


// Create nodemailer transporter
const createTransporter = () => {

  return nodemailer.createTransport({

    service: "gmail",

    auth: {

      user: process.env.EMAIL_USER,

      pass: process.env.EMAIL_PASS,
    },
  });
};



// ======================================================
// ================= FORGOT PASSWORD ====================
// ======================================================


// @desc    Send reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {

  // Get email
  const { email } = req.body;


  // Validate email
  if (!email) {

    return res.status(400).json({

      success: false,

      message: "Email is required",
    });
  }

  try {

    // Set type as reset
    req.body.type = "reset";

    // Send reset OTP
    await sendOtp(req, res);

  } catch (error) {

    console.error("❌ Forgot Password Error:", error);

    res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};



// ======================================================
// ================= RESET PASSWORD =====================
// ======================================================


// @desc    Reset password after OTP verification
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {

  // Get request data
  const {

    email,
    otp,
    newPassword

  } = req.body;


  // Validate fields
  if (!email || !otp || !newPassword) {

    return res.status(400).json({

      success: false,

      message:
        "Email, OTP, and new password are required",
    });
  }

  try {

    // Convert email to lowercase
    const lowerEmail = email
      .toLowerCase()
      .trim();


    // Find OTP record
    const otpRecord = await Otp.findOne({

      email: lowerEmail,

      otp: otp.trim(),
    });


    // Invalid OTP
    if (!otpRecord) {

      return res.status(400).json({

        success: false,

        message: "Invalid OTP",
      });
    }


    // OTP expired
    if (otpRecord.expiresAt < new Date()) {

      await Otp.deleteOne({
        _id: otpRecord._id
      });

      return res.status(400).json({

        success: false,

        message: "OTP expired",
      });
    }


    // Find user
    const user = await User.findOne({
      email: lowerEmail
    });


    // User not found
    if (!user) {

      return res.status(400).json({

        success: false,

        message: "User not found",
      });
    }


    // ================= HASH NEW PASSWORD =================

    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      salt
    );


    // Update password
    user.password = hashedPassword;

    await user.save();


    // Delete OTP after reset
    await Otp.deleteOne({
      _id: otpRecord._id
    });


    // Success response
    res.status(200).json({

      success: true,

      message: "Password reset successful",
    });

  } catch (error) {

    console.error("❌ Reset Password Error:", error);

    res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};