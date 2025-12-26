import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OtpModal from "./OtpModal";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  Briefcase,
  Users,
  BadgeCheck,
  MapPin,
} from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup, completeSignup } = useAuth();
  const navigate = useNavigate();

 const civicDepartments = [
  "Public Works",
  "Sanitation",
  "Street Lighting",
  "Parks and Recreation",
  "Water and Drainage",
  "Traffic and Transportation",
  "Urban Planning",
  "Animal Control",
  "Environmental Services",
  "Other", // 👈 Added this option
];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Role validation
    if (!role) {
      toast.error("Please select your role");
      return;
    }

    // Department validation only if NOT Higher Authority
    if (role !== "Higher Authority" && !department) {
      toast.error("Please select department / service area");
      return;
    }

    // Contact number validation (must be 10 digits)
    if (!/^\d{10}$/.test(contact)) {
      toast.error("Please enter a valid 10-digit contact number");
      return;
    }

    // Employee ID validation (must start with JH)
    if (!/^JH/i.test(employeeId)) {
      toast.error("Employee ID must start with 'JH'");
      return;
    }

    // Forgot Password button click handler
    const handleForgotPasswordClick = () => {
      navigate("/forgot-password");
    };

    try {
      setIsLoading(true);
      const departmentToSubmit = role === "Higher Authority" ? "" : department;
      await signup(email);
      setShowOtpModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setIsLoading(true);
    try {
      const departmentToSubmit = role === "Higher Authority" ? "" : department;
      const { redirectUrl } = await completeSignup(
        name,
        email,
        password,
        role,
        departmentToSubmit,
        contact,
        employeeId, // Employee ID has no constraint now
        address,
        otp
      );
      setShowOtpModal(false);
      navigate(redirectUrl);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F6] relative">
      {/* Watermark emblem */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Jharkhand_Rajakiya_Chihna.svg/1200px-Jharkhand_Rajakiya_Chihna.svg.png"
        alt="Watermark"
        className="absolute w-[350px] opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        email={email}
        title="Verify Your Email"
        description="Please enter the OTP sent to your email address to complete signup."
        isLoading={isLoading}
      />

      <div className="fixed left-1/2 transform -translate-x-1/2 w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border border-green-400 px-4 sm:px-6 md:px-8 py-5 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-transparent z-10 scale-[1.0]">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Jharkhand_Rajakiya_Chihna.svg/1200px-Jharkhand_Rajakiya_Chihna.svg.png"
            alt="Jharkhand Govt Logo"
            className="h-20 mb-4"
          />
          <h1 className="text-3xl font-bold text-green-800 text-center">
            Government of Jharkhand
          </h1>
          <p className="mt-1 text-base text-green-600 text-center font-medium">
            One Portal, Many Voices – Connecting Citizens with Governance
          </p>
          <div className="w-28 border-t-4 border-orange-500 rounded mt-3"></div>
        </div>

        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* Full Name */}
          <div className="relative">
            <User className="absolute top-3 left-3 text-green-600" />
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 w-full px-4 py-3 rounded-md border border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-gray-800 placeholder-gray-500 bg-white/90"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-3 left-3 text-green-600" />
            <input
              type="email"
              placeholder="Dept. Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full px-4 py-3 rounded-md border border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-gray-800 placeholder-gray-500 bg-white/90"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-green-600" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 w-full px-4 py-3 rounded-md border border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-gray-800 placeholder-gray-500 bg-white/90"
            />
            <div
              className="absolute top-3 right-3 cursor-pointer text-green-600"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </div>
          </div>

          {/* Role */}
          <div className="relative">
            <Users className="absolute top-3 left-3 text-green-600" />
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (e.target.value === "Higher Authority") {
                  setDepartment("");
                }
              }}
              className="pl-10 w-full px-4 py-3 rounded-md border border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-gray-800 bg-white/90 cursor-pointer"
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="Higher Authority">Higher Authority</option>
              <option value="Staff">Staff</option>
              <option value="Junior Staff">Junior Staff</option>
            </select>
          </div>

          {/* Department */}
          <div className="relative">
            <Briefcase className="absolute top-3 left-3 text-green-600" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={role === "Higher Authority"}
              className={`pl-10 w-full px-4 py-3 rounded-md border border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-gray-800 bg-white/90 ${
                role === "Higher Authority" ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <option value="" disabled>
                Select department / service area
              </option>
              {civicDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Contact Number */}
          <div className="relative">
            <Phone className="absolute top-3 left-3 text-green-600" />
            <input
              type="tel"
              placeholder="Contact Number"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="pl-10 w-full px-4 py-3 rounded-md border border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-gray-800 placeholder-gray-500 bg-white/90"
            />
          </div>

          {/* Employee ID */}
          <div className="relative">
            <BadgeCheck className="absolute top-3 left-3 text-green-600" />
            <input
              type="text"
              placeholder="Employee ID"
              required
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="pl-10 w-full px-4 py-3 rounded-md border border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-gray-800 placeholder-gray-500 bg-white/90"
            />
          </div>

          {/* Address */}
          <div className="relative sm:col-span-2">
            <MapPin className="absolute top-3 left-3 text-green-600" />
            <input
              type="text"
              placeholder="Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="pl-10 w-full px-4 py-3 rounded-md border border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-gray-800 placeholder-gray-500 bg-white/90"
            />
          </div>

          {/* Submit Button */}
<div className="sm:col-span-2">
  <button
    type="submit"
    disabled={isLoading} // 👈 Disable while loading
    className={`w-full py-3 text-white text-lg font-semibold rounded-md shadow-md transition-colors cursor-pointer ${
      isLoading
        ? "bg-green-400 cursor-not-allowed" // 👈 gray out when disabled
        : "bg-green-700 hover:bg-green-800"
    }`}
  >
    {isLoading ? "Creating Account..." : "Create Account"} {/* 👈 Show loading text */}
  </button>
</div>


          {/* Login and Forgot Password Links */}
          <div className="sm:col-span-2 text-center mt-2">
  <span className="text-gray-700">Already have an account? </span>
  <button
    type="button" // 👈 Prevent form submit
    className="text-green-600 font-semibold hover:underline cursor-pointer"
    onClick={() => navigate("/login")}
  >
    Login here
  </button>
</div>
<div className="sm:col-span-2 text-center mt-2">
  <button
    type="button" // 👈 Prevent form submit
    className="text-green-600 font-semibold hover:underline cursor-pointer"
    onClick={() => navigate("/forgot-password")}
  >
    Forgot Password?
  </button>
</div>

        </form>

        {/* Footer slogan */}
        <div className="text-center mt-4 mb-4 text-sm text-green-700 font-semibold">
          <p>
            Empowering Jharkhand |{" "}
            <span className="text-orange-600">Report. Resolve. Reform 🇮🇳</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
