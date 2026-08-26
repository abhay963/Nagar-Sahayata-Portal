import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import OtpModal from "./OtpModal";

import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Briefcase,
  Users,
  BadgeCheck,
  MapPin,
  ImagePlus,
  ArrowUpRight,
  Eye,
  EyeOff,
} from "lucide-react";

const AuthModal = ({ isOpen, onClose, initialRole = "Citizen" }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [role, setRole] = useState(initialRole);

  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empRole, setEmpRole] = useState("");
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("");
  const [contact, setContact] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [address, setAddress] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup, completeSignup } = useAuth();
  const navigate = useNavigate();

  const civicDepartments = [
    "Environmental Services",
    "Water Supply",
    "Road Maintenance",
    "Electricity Department",
    "Sanitation",
    "Health Department",
    "Traffic Management",
    "Public Safety",
    "Waste Management",
    "Parks and Recreation",
    "Sewerage Department",
    "Fire Department",
    "Urban Planning",
    "Transport Department",
    "Housing Board",
  ];

  const jharkhandCities = [
    "Bokaro",
    "Chaibasa",
    "Chatra",
    "Deoghar",
    "Dhanbad",
    "Dumka",
    "Garhwa",
    "Giridih",
    "Godda",
    "Gumla",
    "Hazaribagh",
    "Jamshedpur",
    "Jamtara",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Medininagar",
    "Pakur",
    "Ramgarh",
    "Ranchi",
    "Sahebganj",
    "Saraikela",
    "Simdega",
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setPassword("");
    setEmpRole("");
    setCity("");
    setDepartment("");
    setContact("");
    setEmployeeId("");
    setAddress("");
    setAcceptedTerms(false);
    setProfileImage(null);
    setProfilePreview("");
    setShowPassword(false);
    setShowOtpModal(false);
    setActiveTab("login");
    setRole(initialRole);

    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      // =========================
      // LOGIN
      // =========================
      if (activeTab === "login") {
        const result = await login(email, password);

        toast.success("Login successful");

        handleClose();

        if (result.role === "Citizen") {
          navigate("/citizen-dashboard", { replace: true });
        } else if (result.role === "Higher Authority") {
          navigate("/admin-dashboard", { replace: true });
        } else if (result.role === "Staff") {
          navigate("/staff-dashboard", { replace: true });
        } else if (result.role === "Junior Staff") {
          navigate("/junior-dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }

        return;
      }

      // =========================
      // SIGNUP VALIDATION
      // =========================

      if (!city) {
        toast.error("Please select your city");
        setIsLoading(false);
        return;
      }

      if (!/^\d{10}$/.test(contact)) {
        toast.error("Please enter a valid 10-digit contact number");
        setIsLoading(false);
        return;
      }

      // =========================
      // EMPLOYEE VALIDATION
      // =========================

      if (role === "Employee") {
        if (!empRole) {
          toast.error("Please select your role");
          setIsLoading(false);
          return;
        }

        if (empRole !== "Higher Authority" && !department) {
          toast.error("Please select a department");
          setIsLoading(false);
          return;
        }

        if (!/^JH/i.test(employeeId.trim())) {
          toast.error("Employee ID must start with 'JH'");
          setIsLoading(false);
          return;
        }

        if (!profileImage) {
          toast.error("Please upload your profile image");
          setIsLoading(false);
          return;
        }
      }

      if (!acceptedTerms) {
        toast.error("Please accept the terms and declaration");
        setIsLoading(false);
        return;
      }

      // =========================
      // SEND OTP
      // =========================

      await signup(email);

      setShowOtpModal(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Authentication failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append(
        "role",
        role === "Citizen" ? "Citizen" : empRole
      );
      formData.append("city", city);
      formData.append("contact", contact);
      formData.append("address", address);
      formData.append("acceptedTerms", acceptedTerms);
      formData.append("otp", otp);

      if (role === "Employee") {
        formData.append("empId", employeeId);

        formData.append(
          "department",
          empRole === "Higher Authority" ? "" : department
        );
      } else {
        formData.append("empId", "");
        formData.append("department", "");
      }

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const result = await completeSignup(formData);

      setShowOtpModal(false);

      toast.success("Registration successful.");

      handleClose();

      if (result.role === "Citizen") {
        navigate("/citizen-dashboard", { replace: true });
      } else if (result.role === "Higher Authority") {
        navigate("/admin-dashboard", { replace: true });
      } else if (result.role === "Staff") {
        navigate("/staff-dashboard", { replace: true });
      } else if (result.role === "Junior Staff") {
        navigate("/junior-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Verification failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* =========================
          OTP MODAL
      ========================= */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        email={email}
        title="Verify Your Email"
        description="Please enter the OTP sent to your email address to complete registration."
        isLoading={isLoading}
      />

      <AnimatePresence>
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-md
            px-4
            py-6
            overflow-y-auto
          "
        >
          {/* =========================
              MAIN MODAL
          ========================= */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              relative
              z-[101]
              w-full
              max-w-2xl
              max-h-[calc(100vh-3rem)]
              bg-gradient-to-br
              from-emerald-950/95
              via-[#062419]/95
              to-teal-950/95
              border
              border-white/10
              rounded-[2.5rem]
              shadow-2xl
              overflow-hidden
              flex
              flex-col
              text-white
            "
          >
            {/* =========================
                HEADER
            ========================= */}
            <div
              className="
                p-5
                sm:p-6
                border-b
                border-white/10
                flex
                items-center
                justify-between
                shrink-0
              "
            >
              {/* Logo + Title */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="
                    bg-white/10
                    backdrop-blur-md
                    p-2
                    rounded-xl
                    border
                    border-white/20
                    shrink-0
                  "
                >
                  <img
                    src="/government-of-jharkhand.png"
                    alt="Gov of Jharkhand"
                    className="w-8 h-8 object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight truncate">
                    {role === "Citizen"
                      ? "Citizen Portal"
                      : "Officer Portal"}
                  </h2>

                  <p className="text-xs text-emerald-300 font-light tracking-wide">
                    Nagar Sahayata · Jharkhand
                  </p>
                </div>
              </div>

              {/* =========================
                  CLOSE BUTTON
              ========================= */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close modal"
                className="
                  relative
                  z-[110]
                  flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  rounded-xl
                  bg-white/10
                  border
                  border-white/20
                  hover:bg-white/20
                  text-emerald-300
                  hover:text-white
                  transition-all
                  cursor-pointer
                  shrink-0
                  ml-3
                "
              >
                <X
                  size={22}
                  strokeWidth={2.5}
                />
              </button>
            </div>

            {/* =========================
                SCROLLABLE CONTENT
            ========================= */}
            <div
              className="
                p-5
                sm:p-6
                overflow-y-auto
                flex-1
                min-h-0
                scrollbar-thin
                scrollbar-thumb-emerald-500/30
                scrollbar-track-transparent
              "
            >
              {/* =========================
                  PORTAL SELECTOR
              ========================= */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setRole("Citizen");
                    setEmpRole("");
                    setDepartment("");
                    setEmployeeId("");
                    setActiveTab("login");
                  }}
                  className={`
                    rounded-xl
                    border
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    transition
                    cursor-pointer
                    ${
                      role === "Citizen"
                        ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                        : "border-white/10 bg-white/5 text-white/50 hover:text-white"
                    }
                  `}
                >
                  Citizen
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("Employee");
                    setActiveTab("login");
                  }}
                  className={`
                    rounded-xl
                    border
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    transition
                    cursor-pointer
                    ${
                      role === "Employee"
                        ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                        : "border-white/10 bg-white/5 text-white/50 hover:text-white"
                    }
                  `}
                >
                  Employee
                </button>
              </div>

              {/* =========================
                  LOGIN / REGISTER TABS
              ========================= */}
              <div
                className="
                  flex
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  p-1
                  mb-6
                "
              >
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className={`
                    w-1/2
                    py-2.5
                    rounded-xl
                    font-bold
                    transition-all
                    text-sm
                    cursor-pointer
                    ${
                      activeTab === "login"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                        : "text-emerald-100/60 hover:text-white"
                    }
                  `}
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className={`
                    w-1/2
                    py-2.5
                    rounded-xl
                    font-bold
                    transition-all
                    text-sm
                    cursor-pointer
                    ${
                      activeTab === "signup"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                        : "text-emerald-100/60 hover:text-white"
                    }
                  `}
                >
                  Register
                </button>
              </div>

              {/* =========================
                  FORM
              ========================= */}
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* =========================
                    NAME
                ========================= */}
                {activeTab === "signup" && (
                  <div className="relative group">
                    <User
                      size={18}
                      className="
                        absolute
                        left-4
                        top-4
                        text-emerald-300/50
                      "
                    />

                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      required
                      className="
                        w-full
                        pl-12
                        pr-4
                        py-3.5
                        rounded-2xl
                        bg-white/5
                        border
                        border-white/10
                        focus:border-emerald-500/40
                        outline-none
                        text-white
                        placeholder:text-emerald-100/35
                      "
                    />
                  </div>
                )}

                {/* =========================
                    EMAIL
                ========================= */}
                <div className="relative group">
                  <Mail
                    size={18}
                    className="
                      absolute
                      left-4
                      top-4
                      text-emerald-300/50
                    "
                  />

                  <input
                    type="email"
                    placeholder={
                      role === "Citizen"
                        ? "Email Address"
                        : "Department Email Address"
                    }
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    className="
                      w-full
                      pl-12
                      pr-4
                      py-3.5
                      rounded-2xl
                      bg-white/5
                      border
                      border-white/10
                      focus:border-emerald-500/40
                      outline-none
                      text-white
                      placeholder:text-emerald-100/35
                    "
                  />
                </div>

                {/* =========================
                    PASSWORD
                ========================= */}
                <div className="relative group">
                  <Lock
                    size={18}
                    className="
                      absolute
                      left-4
                      top-4
                      text-emerald-300/50
                    "
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                    className="
                      w-full
                      pl-12
                      pr-12
                      py-3.5
                      rounded-2xl
                      bg-white/5
                      border
                      border-white/10
                      focus:border-emerald-500/40
                      outline-none
                      text-white
                      placeholder:text-emerald-100/35
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="
                      absolute
                      right-4
                      top-4
                      text-emerald-100/40
                      hover:text-white
                      cursor-pointer
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {/* =========================
                    SIGNUP FIELDS
                ========================= */}
                {activeTab === "signup" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* =========================
                        EMPLOYEE ROLE
                    ========================= */}
                    {role === "Employee" && (
                      <div className="relative">
                        <Users
                          size={18}
                          className="
                            absolute
                            left-4
                            top-4
                            text-emerald-300/50
                          "
                        />

                        <select
                          value={empRole}
                          onChange={(e) => {
                            setEmpRole(e.target.value);

                            if (
                              e.target.value ===
                              "Higher Authority"
                            ) {
                              setDepartment("");
                            }
                          }}
                          required
                          className="
                            w-full
                            pl-12
                            pr-4
                            py-3.5
                            rounded-2xl
                            bg-white/5
                            border
                            border-white/10
                            focus:border-emerald-500/40
                            outline-none
                            text-white
                            appearance-none
                            cursor-pointer
                          "
                        >
                          <option
                            className="bg-[#062419]"
                            value=""
                          >
                            Select Role
                          </option>

                          <option
                            className="bg-[#062419]"
                            value="Higher Authority"
                          >
                            Higher Authority
                          </option>

                          <option
                            className="bg-[#062419]"
                            value="Staff"
                          >
                            Staff
                          </option>

                          <option
                            className="bg-[#062419]"
                            value="Junior Staff"
                          >
                            Junior Staff
                          </option>
                        </select>
                      </div>
                    )}

                    {/* =========================
                        CITY
                    ========================= */}
                    <div className="relative">
                      <MapPin
                        size={18}
                        className="
                          absolute
                          left-4
                          top-4
                          text-emerald-300/50
                        "
                      />

                      <select
                        value={city}
                        onChange={(e) =>
                          setCity(e.target.value)
                        }
                        required
                        className="
                          w-full
                          pl-12
                          pr-4
                          py-3.5
                          rounded-2xl
                          bg-white/5
                          border
                          border-white/10
                          focus:border-emerald-500/40
                          outline-none
                          text-white
                          appearance-none
                          cursor-pointer
                        "
                      >
                        <option
                          className="bg-[#062419]"
                          value=""
                        >
                          Select City
                        </option>

                        {jharkhandCities.map(
                          (cityName) => (
                            <option
                              key={cityName}
                              value={cityName}
                              className="bg-[#062419]"
                            >
                              {cityName}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* =========================
                        DEPARTMENT
                    ========================= */}
                    {role === "Employee" && (
                      <div className="relative">
                        <Briefcase
                          size={18}
                          className="
                            absolute
                            left-4
                            top-4
                            text-emerald-300/50
                          "
                        />

                        <select
                          value={department}
                          onChange={(e) =>
                            setDepartment(
                              e.target.value
                            )
                          }
                          disabled={
                            empRole ===
                            "Higher Authority"
                          }
                          required={
                            empRole !==
                            "Higher Authority"
                          }
                          className={`
                            w-full
                            pl-12
                            pr-4
                            py-3.5
                            rounded-2xl
                            border
                            outline-none
                            appearance-none
                            transition-all
                            ${
                              empRole ===
                              "Higher Authority"
                                ? "bg-white/[0.03] border-white/5 text-white/30 cursor-not-allowed"
                                : "bg-white/5 border-white/10 text-white cursor-pointer focus:border-emerald-500/40"
                            }
                          `}
                        >
                          <option
                            className="bg-[#062419]"
                            value=""
                          >
                            Select Department
                          </option>

                          {civicDepartments.map(
                            (dept) => (
                              <option
                                className="bg-[#062419]"
                                key={dept}
                                value={dept}
                              >
                                {dept}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    )}

                    {/* =========================
                        CONTACT
                    ========================= */}
                    <div className="relative">
                      <Phone
                        size={18}
                        className="
                          absolute
                          left-4
                          top-4
                          text-emerald-300/50
                        "
                      />

                      <input
                        type="tel"
                        placeholder="Contact Number"
                        value={contact}
                        onChange={(e) =>
                          setContact(e.target.value)
                        }
                        required
                        maxLength={10}
                        className="
                          w-full
                          pl-12
                          pr-4
                          py-3.5
                          rounded-2xl
                          bg-white/5
                          border
                          border-white/10
                          focus:border-emerald-500/40
                          outline-none
                          text-white
                          placeholder:text-emerald-100/35
                        "
                      />
                    </div>

                    {/* =========================
                        EMPLOYEE ID
                    ========================= */}
                    {role === "Employee" && (
                      <div className="relative sm:col-span-2">
                        <BadgeCheck
                          size={18}
                          className="
                            absolute
                            left-4
                            top-4
                            text-emerald-300/50
                          "
                        />

                        <input
                          type="text"
                          placeholder="Employee ID (JH...)"
                          value={employeeId}
                          onChange={(e) =>
                            setEmployeeId(
                              e.target.value
                            )
                          }
                          required
                          className="
                            w-full
                            pl-12
                            pr-4
                            py-3.5
                            rounded-2xl
                            bg-white/5
                            border
                            border-white/10
                            focus:border-emerald-500/40
                            outline-none
                            text-white
                            placeholder:text-emerald-100/35
                          "
                        />
                      </div>
                    )}

                    {/* =========================
                        PROFILE IMAGE
                    ========================= */}
                    <div className="relative sm:col-span-2">
                      <div className="flex items-center gap-4">
                        <label
                          className="
                            flex
                            items-center
                            gap-3
                            px-5
                            py-4
                            rounded-2xl
                            bg-white/5
                            border
                            border-white/10
                            cursor-pointer
                            hover:border-emerald-500/40
                            transition-all
                            w-full
                          "
                        >
                          <ImagePlus
                            size={20}
                            className="text-emerald-400"
                          />

                          <span className="text-emerald-100/70 text-sm">
                            Upload Profile Image (
                            {role === "Citizen"
                              ? "Optional"
                              : "Required"}
                            )
                          </span>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={
                              handleImageChange
                            }
                            className="hidden"
                          />
                        </label>

                        {profilePreview && (
                          <img
                            src={profilePreview}
                            alt="Profile preview"
                            className="
                              w-14
                              h-14
                              rounded-xl
                              object-cover
                              border
                              border-white/10
                              shrink-0
                            "
                          />
                        )}
                      </div>
                    </div>

                    {/* =========================
                        ADDRESS
                    ========================= */}
                    <div className="relative sm:col-span-2">
                      <MapPin
                        size={18}
                        className="
                          absolute
                          left-4
                          top-4
                          text-emerald-300/50
                        "
                      />

                      <input
                        type="text"
                        placeholder={
                          role === "Citizen"
                            ? "Residential Address (Optional)"
                            : "Official Posting Address (Optional)"
                        }
                        value={address}
                        onChange={(e) =>
                          setAddress(e.target.value)
                        }
                        className="
                          w-full
                          pl-12
                          pr-4
                          py-3.5
                          rounded-2xl
                          bg-white/5
                          border
                          border-white/10
                          focus:border-emerald-500/40
                          outline-none
                          text-white
                          placeholder:text-emerald-100/35
                        "
                      />
                    </div>

                    {/* =========================
                        DECLARATION
                    ========================= */}
                    <div className="sm:col-span-2">
                      <label
                        className="
                          flex
                          items-start
                          gap-3
                          text-xs
                          text-emerald-100/70
                          cursor-pointer
                        "
                      >
                        <input
                          type="checkbox"
                          checked={acceptedTerms}
                          onChange={(e) =>
                            setAcceptedTerms(
                              e.target.checked
                            )
                          }
                          className="
                            mt-1
                            accent-emerald-500
                            shrink-0
                          "
                        />

                        <span>
                          {role === "Citizen"
                            ? "I declare that the information provided is correct. I am registering as a citizen of Jharkhand to submit and track local public grievances."
                            : "I confirm that I am an authorized government / municipal employee. Any misuse may lead to legal or administrative action."}
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* =========================
                    SUBMIT BUTTON
                ========================= */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`
                    w-full
                    py-4
                    rounded-2xl
                    font-bold
                    text-lg
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition-all
                    cursor-pointer
                    ${
                      isLoading
                        ? "bg-white/10 text-white/50 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-900/30"
                    }
                  `}
                >
                  {isLoading ? (
                    "Please wait..."
                  ) : (
                    <>
                      {activeTab === "login"
                        ? "Sign In"
                        : "Register"}

                      <ArrowUpRight size={20} />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
};

export default AuthModal;