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

  const { email } = req.body;

  if (!email) {

    return res.status(400).json({

      success: false,

      message: "Email is required",
    });
  }

  try {

    req.body.type = "signup";

    await sendOtp(req, res);

  } catch (error) {

    console.error(
      "❌ Signup Error:",
      error
    );

    res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};

export const completeSignup = async (req, res) => {

  try {

    // ================= GET DATA FROM FORM =================

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


    // ================= SAFE TRIMMING =================

 name = String(name || "").trim();

email = String(email || "")
  .trim()
  .toLowerCase();

password = String(password || "").trim();

role = String(role || "").trim();

department = String(department || "").trim();

city = String(city || "").trim();

contact = String(contact || "").trim();

empId = String(empId || "")
  .trim()
  .toUpperCase();
  // ================= VALID EMPLOYEE ID CHECK =================



address = String(address || "").trim();

otp = String(otp || "").trim();
    // ================= VALIDATION =================

    if (
      !name ||
      !email ||
      !password ||
      !role ||
      !city ||
      !contact ||
      !empId ||
      !otp ||
      (
        role !== "Higher Authority" &&
        !department
      )
    ) {

      return res.status(400).json({

        success: false,

        message: "All required fields must be filled",
      });
    }


    // ================= TERMS VALIDATION =================

    if (
      acceptedTerms !== true &&
      acceptedTerms !== "true"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Please accept terms and conditions",
      });
    }

// ================= VALID EMPLOYEE ID CHECK =================

if (!allowedEmpIds.includes(empId)) {

  return res.status(400).json({

    success: false,

    message:
      "Invalid Employee ID",
  });
}
    // ================= VERIFY OTP =================

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


    // ================= OTP EXPIRY =================

    if (
      otpRecord.expiresAt <
      new Date()
    ) {

      await Otp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({

        success: false,

        message: "OTP expired",
      });
    }


    // ================= CHECK EMAIL EXISTS =================

    const emailExists =
      await User.findOne({
        email,
      });

    if (emailExists) {

      return res.status(400).json({

        success: false,

        message:
          "Email already registered",
      });
    }


    // ================= CHECK EMPLOYEE ID EXISTS =================

    const empIdExists =
      await User.findOne({
        empId,
      });

    if (empIdExists) {

      return res.status(400).json({

        success: false,

        message:
          "Employee ID already registered",
      });
    }


    // ================= HASH PASSWORD =================

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );


    // ================= PROFILE IMAGE =================

    const profileImage =
      req.file?.path || "";


    // ================= CREATE USER =================

    const user =
      await User.create({

        name,

        email,

        password:
          hashedPassword,

        role,

        department:
          role === "Higher Authority"
            ? ""
            : department,

        city,

        contact,

        empId,

        address:
          address || "",

        acceptedTerms:
          acceptedTerms === true ||
          acceptedTerms === "true",

        isApproved: true,

        accountStatus: "Active",

        profileImage,
      });


    // ================= DELETE USED OTP =================

    await Otp.deleteOne({
      _id: otpRecord._id,
    });


    // ================= GENERATE TOKEN =================

    const token =
      generateToken(user._id);


    // ================= RESPONSE =================

    res.status(201).json({

      success: true,

      message:
        "Registration successful.",

      _id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      department:
        user.department,

      city: user.city,

      contact: user.contact,

      empId: user.empId,

      address: user.address,

      profileImage:
        user.profileImage,

      joiningDate:
        user.joiningDate,

      isApproved:
        user.isApproved,

      accountStatus:
        user.accountStatus,

      token,

      redirectUrl: "/",
    });

  } catch (error) {

    console.error(
      "❌ Complete Signup Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        error.message ||
        "Server error during signup",
    });
  }
};


export const login =
  async (req, res) => {

    const {
      email,
      password,
    } = req.body;

    try {

      const user =
        await User.findOne({

          email:
            email
            .toLowerCase(),
        });

      if (
        user &&
        (
          await bcrypt.compare(
            password,
            user.password
          )
        )
      ) {

        if (
          !user.isApproved
        ) {

          return res.status(403)
          .json({

            success: false,

            message:
              "Your account is pending approval",
          });
        }

        if (
          user.accountStatus !==
          "Active"
        ) {

          return res.status(403)
          .json({

            success: false,

            message:
              `Your account is ${user.accountStatus}`,
          });
        }

        const token =
          generateToken(
            user._id
          );

        let redirectUrl =
          "/staff-dashboard";

        if (
          user.role ===
          "Higher Authority"
        ) {

          redirectUrl =
            "/admin-dashboard";
        }

        if (
          user.role ===
          "Junior Staff"
        ) {

          redirectUrl =
            "/junior-dashboard";
        }

        res.json({

          success: true,

          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          department:
            user.department,

          city:
            user.city,

          contact:
            user.contact,

          empId:
            user.empId,

          address:
            user.address,

          profileImage:
            user.profileImage,

          joiningDate:
            user.joiningDate,

          isApproved:
            user.isApproved,

          accountStatus:
            user.accountStatus,

          token,

          redirectUrl,
        });

      } else {

        res.status(401)
        .json({

          success: false,

          message:
            "Invalid email or password",
        });
      }

    } catch (error) {

      console.error(
        "❌ Login Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };


export const getMe =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        )

        .select("-password");

      if (!user) {

        return res.status(404)
        .json({

          success: false,

          message:
            "User not found",
        });
      }

      res.json({

        success: true,

        user,
      });

    } catch (error) {

      console.error(
        "❌ GetMe Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };


export const sendOtp =
  async (req, res) => {

    const {
      email,
      type,
    } = req.body;

    if (!email) {

      return res.status(400)
      .json({

        success: false,

        message:
          "Email is required",
      });
    }

    const lowerEmail =
      email
      .toLowerCase()
      .trim();

    try {

      if (
        type === "signup"
      ) {

        const existingUser =
          await User.findOne({

            email:
              lowerEmail,
          });

        if (existingUser) {

          return res.status(400)
          .json({

            success: false,

            message:
              "Email already registered",
          });
        }
      }

      if (
        type === "reset"
      ) {

        const existingUser =
          await User.findOne({

            email:
              lowerEmail,
          });

        if (!existingUser) {

          return res.status(400)
          .json({

            success: false,

            message:
              "Email not registered",
          });
        }
      }

      await Otp.deleteMany({

        email:
          lowerEmail,
      });

      const otp =
        generateOTP();

      await Otp.create({

        email:
          lowerEmail,

        otp,
      });

      const transporter =
        createTransporter();

     const mailOptions = {

  from: process.env.EMAIL_USER,

  to: email,

  subject:
    type === "signup"
      ? "Verify Your Email - Nagar Sahayata"
      : "Reset Your Password - Nagar Sahayata",

  html: `
  
  <div style="
    font-family: Arial, sans-serif;
    background: #f4f7fb;
    padding: 40px 20px;
  ">

    <div style="
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    ">

      <!-- HEADER -->
      <div style="
        background: linear-gradient(135deg, #059669, #0f766e);
        padding: 35px;
        text-align: center;
      ">

        <h1 style="
          color: white;
          margin: 0;
          font-size: 30px;
          font-weight: bold;
        ">
          Nagar Sahayata
        </h1>

        <p style="
          color: #d1fae5;
          margin-top: 10px;
          font-size: 15px;
        ">
          Smart Civic Issue Management Platform
        </p>

      </div>

      <!-- BODY -->
      <div style="
        padding: 40px 35px;
        text-align: center;
      ">

        <h2 style="
          color: #111827;
          margin-bottom: 15px;
          font-size: 26px;
        ">
          ${
            type === "signup"
              ? "Verify Your Email"
              : "Reset Your Password"
          }
        </h2>

        <p style="
          color: #6b7280;
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 30px;
        ">
          Use the OTP below to ${
            type === "signup"
              ? "complete your email verification"
              : "reset your password"
          }.
          This OTP is valid for only 
          <strong>5 minutes</strong>.
        </p>

        <!-- OTP BOX -->
        <div style="
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          border: 2px dashed #10b981;
          border-radius: 16px;
          padding: 25px;
          margin: 30px auto;
          width: fit-content;
        ">

          <span style="
            font-size: 42px;
            letter-spacing: 10px;
            font-weight: bold;
            color: #065f46;
          ">
            ${otp}
          </span>

        </div>

        <p style="
          color: #9ca3af;
          font-size: 14px;
          margin-top: 25px;
          line-height: 1.6;
        ">
          If you did not request this OTP,
          please ignore this email.
        </p>

      </div>

      <!-- FOOTER -->
      <div style="
        background: #f9fafb;
        padding: 25px;
        text-align: center;
        border-top: 1px solid #e5e7eb;
      ">

        <p style="
          color: #6b7280;
          font-size: 13px;
          margin: 0;
        ">
          © ${new Date().getFullYear()} Nagar Sahayata.
          All rights reserved.
        </p>

      </div>

    </div>

  </div>
  `,
};

      await transporter.sendMail(
        mailOptions
      );

      res.status(200).json({

        success: true,

        message:
          "OTP sent successfully",
      });

    } catch (error) {

      console.error(
        "❌ Send OTP Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };


const generateOTP = () => {

  return Math.floor(

    100000 +

    Math.random() * 900000

  ).toString();
};


export const verifyOtp =
  async (req, res) => {

    const {
      email,
      otp,
    } = req.body;

    if (!email || !otp) {

      return res.status(400)
      .json({

        success: false,

        message:
          "Email and OTP are required",
      });
    }

    try {

      const lowerEmail =
        email
        .toLowerCase()
        .trim();

      const otpRecord =
        await Otp.findOne({

          email:
            lowerEmail,

          otp:
            otp.trim(),
        });

      if (!otpRecord) {

        return res.status(400)
        .json({

          success: false,

          message:
            "Invalid OTP",
        });
      }

      if (
        otpRecord.expiresAt <
        new Date()
      ) {

        await Otp.deleteOne({
          _id:
            otpRecord._id,
        });

        return res.status(400)
        .json({

          success: false,

          message:
            "OTP expired",
        });
      }

      res.status(200).json({

        success: true,

        message:
          "OTP verified successfully",
      });

    } catch (error) {

      console.error(
        "❌ Verify OTP Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
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


export const forgotPassword =
  async (req, res) => {

    const { email } =
      req.body;

    if (!email) {

      return res.status(400)
      .json({

        success: false,

        message:
          "Email is required",
      });
    }

    try {

      req.body.type =
        "reset";

      await sendOtp(
        req,
        res
      );

    } catch (error) {

      console.error(
        "❌ Forgot Password Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };


export const resetPassword =
  async (req, res) => {

    const {

      email,
      otp,
      newPassword,

    } = req.body;

    if (
      !email ||
      !otp ||
      !newPassword
    ) {

      return res.status(400)
      .json({

        success: false,

        message:
          "Email, OTP, and new password are required",
      });
    }

    try {

      const lowerEmail =
        email
        .toLowerCase()
        .trim();

      const otpRecord =
        await Otp.findOne({

          email:
            lowerEmail,

          otp:
            otp.trim(),
        });

      if (!otpRecord) {

        return res.status(400)
        .json({

          success: false,

          message:
            "Invalid OTP",
        });
      }

      if (
        otpRecord.expiresAt <
        new Date()
      ) {

        await Otp.deleteOne({
          _id:
            otpRecord._id,
        });

        return res.status(400)
        .json({

          success: false,

          message:
            "OTP expired",
        });
      }

      const user =
        await User.findOne({

          email:
            lowerEmail,
        });

      if (!user) {

        return res.status(400)
        .json({

          success: false,

          message:
            "User not found",
        });
      }

      const salt =
        await bcrypt.genSalt(10);

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          salt
        );

      user.password =
        hashedPassword;

      await user.save();

      await Otp.deleteOne({
        _id:
          otpRecord._id,
      });

      res.status(200).json({

        success: true,

        message:
          "Password reset successful",
      });

    } catch (error) {

      console.error(
        "❌ Reset Password Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };