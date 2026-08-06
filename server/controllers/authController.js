import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import User from "../models/User.js";
import Otp from "../models/Otp.js";

const generateToken = (id) => {

  return jwt.sign(

    { id },

    process.env.JWT_SECRET,

    {
      expiresIn: "1h",
    }
  );
};

// ================= ALLOWED EMPLOYEE IDS =================

const allowedEmpIds = [

  "JH12",
  "JH13",
  "JH14",
  "JH15",
  "JH16",
  "JH17",
  "JH18",
  "JH19",
  "JH20",
  "JH21",
  "JH22",
  "JH23",
  "JH24",
  "JH25",
  "JH26",
  "JH27",
  "JH28",
  "JH29",
  "JH30",
  "JH31",

];
export const signup = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    req.body.type = "signup";

    await sendOtp(req, res);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const completeSignup = async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      role,
      department,
      city,
      contact,
      empId,
      address,
      acceptedTerms,
      otp,
    } = req.body;

    name = String(name || "").trim();
    email = String(email || "").trim().toLowerCase();
    password = String(password || "").trim();
    role = String(role || "").trim();
    department = String(department || "").trim();
    city = String(city || "").trim();
    contact = String(contact || "").trim();
    empId = String(empId || "").trim().toUpperCase();
    address = String(address || "").trim();
    otp = String(otp || "").trim();

    if (
      !name ||
      !email ||
      !password ||
      !role ||
      !city ||
      !contact ||
      !empId ||
      !otp ||
      (role !== "Higher Authority" && !department)
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    if (
      acceptedTerms !== true &&
      acceptedTerms !== "true"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please accept terms and conditions",
      });
    }

    if (!allowedEmpIds.includes(empId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employee ID",
      });
    }

    const otpRecord = await Otp.findOne({
      email,
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const emailExists = await User.findOne({
      email,
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const empIdExists = await User.findOne({
      empId,
    });

    if (empIdExists) {
      return res.status(400).json({
        success: false,
        message: "Employee ID already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department:
        role === "Higher Authority"
          ? ""
          : department,
      city,
      contact,
      empId,
      address,
      acceptedTerms:
        acceptedTerms === true ||
        acceptedTerms === "true",
      isApproved: true,
      accountStatus: "Active",
      profileImage: req.file?.path || "",
    });

    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful.",

      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      city: user.city,
      contact: user.contact,
      empId: user.empId,
      address: user.address,
      profileImage: user.profileImage,
      joiningDate: user.joiningDate,
      isApproved: user.isApproved,
      accountStatus: user.accountStatus,

      token,
      redirectUrl: "/",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.accountStatus !== "Active") {
      return res.status(403).json({
        success: false,
        message: `Your account is ${user.accountStatus}`,
      });
    }

    const token = generateToken(user._id);

    let redirectUrl = "/staff-dashboard";

    if (user.role === "Higher Authority") {
      redirectUrl = "/admin-dashboard";
    }

    if (user.role === "Junior Staff") {
      redirectUrl = "/junior-dashboard";
    }

    res.status(200).json({
      success: true,

      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      city: user.city,
      contact: user.contact,
      empId: user.empId,
      address: user.address,
      profileImage: user.profileImage,
      joiningDate: user.joiningDate,
      isApproved: user.isApproved,
      accountStatus: user.accountStatus,

      token,
      redirectUrl,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const sendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const lowerEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: lowerEmail,
    });

    if (type === "signup" && existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    if (type === "reset" && !existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email not registered",
      });
    }

    await Otp.deleteMany({
      email: lowerEmail,
    });

    const otp = generateOTP();

    await Otp.create({
      email: lowerEmail,
      otp,
    });

    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: lowerEmail,
      subject:
        type === "signup"
          ? "Verify Your Email - Nagar Sahayata"
          : "Reset Your Password - Nagar Sahayata",
      html: `
      <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:40px 20px;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.08);">

          <div style="background:linear-gradient(135deg,#059669,#0f766e);padding:35px;text-align:center;">
            <h1 style="color:white;margin:0;">Nagar Sahayata</h1>
            <p style="color:#d1fae5;">
              Smart Civic Issue Management Platform
            </p>
          </div>

          <div style="padding:40px;text-align:center;">

            <h2>
              ${
                type === "signup"
                  ? "Verify Your Email"
                  : "Reset Your Password"
              }
            </h2>

            <p>
              Use the OTP below to ${
                type === "signup"
                  ? "complete your email verification"
                  : "reset your password"
              }.
              <br/>
              OTP is valid for <b>5 minutes</b>.
            </p>

            <div style="margin:30px auto;padding:20px;border-radius:12px;background:#ecfdf5;border:2px dashed #10b981;width:fit-content;">
              <span style="font-size:40px;font-weight:bold;letter-spacing:8px;">
                ${otp}
              </span>
            </div>

            <p style="color:gray;">
              If you didn't request this email, you can safely ignore it.
            </p>

          </div>

          <div style="padding:20px;text-align:center;background:#f9fafb;">
            © ${new Date().getFullYear()} Nagar Sahayata
          </div>

        </div>
      </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const generateOTP = () => {

  return Math.floor(

    100000 +

    Math.random() * 900000

  ).toString();
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const lowerEmail = email.trim().toLowerCase();

    const otpRecord = await Otp.findOne({
      email: lowerEmail,
      otp: otp.trim(),
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const createTransporter = () => {

  return nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    req.body.type = "reset";

    await sendOtp(req, res);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required",
      });
    }

    const lowerEmail = email.trim().toLowerCase();

    const otpRecord = await Otp.findOne({
      email: lowerEmail,
      otp: otp.trim(),
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const user = await User.findOne({
      email: lowerEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    await user.save();

    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};