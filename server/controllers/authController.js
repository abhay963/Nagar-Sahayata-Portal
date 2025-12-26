import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import Otp from "../models/Otp.js";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// @desc    Initiate signup - Send OTP
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Use sendOtp with type 'signup'
    req.body.type = "signup";
    await sendOtp(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete signup after OTP verification
// @route   POST /api/auth/complete-signup
// @access  Public
export const completeSignup = async (req, res) => {
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

  role = role.trim();

  console.log("Signup role:", role);

  if (!name || !email || !password || !role || !contact || !empId || !address || !otp || (role !== "Higher Authority" && !department)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const lowerEmail = email.toLowerCase();
    const otpRecord = await Otp.findOne({ email: lowerEmail, otp: otp.trim() });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    // Check if email or empId exists
    const emailExists = await User.findOne({ email: lowerEmail });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const empIdExists = await User.findOne({ empId });
    if (empIdExists) {
      return res.status(400).json({ message: "Employee ID already registered" });
    }

    // Hash password and create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

    await Otp.deleteOne({ _id: otpRecord._id });

    const token = generateToken(user._id);

    res.status(201).json({
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      let redirectUrl = "/staff-dashboard";
      if (user.role === "Higher Authority") {
        redirectUrl = "/admin-dashboard";
      }

      res.json({
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
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send OTP
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOtp = async (req, res) => {
  const { email, type } = req.body; // type: 'signup' or 'reset'

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const lowerEmail = email.toLowerCase().trim();

  try {
    // For signup, check if user already exists
    if (type === 'signup') {
      const existingUser = await User.findOne({ email: lowerEmail });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    // For reset, check if user exists
    if (type === 'reset') {
      const existingUser = await User.findOne({ email: lowerEmail });
      if (!existingUser) {
        return res.status(400).json({ message: "Email not registered" });
      }
    }

    // Delete any existing OTP for this email
    await Otp.deleteMany({ email: lowerEmail });

    // Generate and save new OTP
    const otp = generateOTP();
    await Otp.create({ email: lowerEmail, otp });

    // Send OTP via email
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: type === 'signup' ? 'Email Verification OTP' : 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${type === 'signup' ? 'Email Verification' : 'Password Reset'}</h2>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: error.message });
  }
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const lowerEmail = email.toLowerCase().trim();
    const otpRecord = await Otp.findOne({ email: lowerEmail, otp: otp.trim() });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// @desc    Initiate password reset - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Use sendOtp with type 'reset'
    req.body.type = "reset";
    await sendOtp(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password after OTP verification
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP, and new password are required" });
  }

  try {
    const lowerEmail = email.toLowerCase().trim();
    const otpRecord = await Otp.findOne({ email: lowerEmail, otp: otp.trim() });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    // Check if user exists
    const user = await User.findOne({ email: lowerEmail });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Delete OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: error.message });
  }
};
