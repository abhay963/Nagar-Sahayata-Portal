import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
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
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Sparkles,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select your role");
      return;
    }

    if (role !== "Higher Authority" && !department) {
      toast.error("Please select department / service area");
      return;
    }

    if (!/^\d{10}$/.test(contact)) {
      toast.error("Please enter a valid 10-digit contact number");
      return;
    }

    if (!/^JH/i.test(employeeId)) {
      toast.error("Employee ID must start with 'JH'");
      return;
    }

    try {
      setIsLoading(true);
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
      const departmentToSubmit =
        role === "Higher Authority" ? "" : department;

      const { redirectUrl } = await completeSignup(
        name,
        email,
        password,
        role,
        departmentToSubmit,
        contact,
        employeeId,
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
    <div className="min-h-screen bg-[#062419] overflow-hidden text-white relative">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#10b98125_0%,transparent_35%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,#14b8a620_0%,transparent_35%)] pointer-events-none" />

      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 pt-4">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-emerald-900/90 via-green-800/90 to-teal-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* LOGO */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <motion.div
                whileHover={{ rotate: 8, scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20"
              >
                <img
                  src="/government-of-jharkhand.png"
                  alt="Government of Jharkhand"
                  className="w-9 h-9 object-contain"
                />
              </motion.div>

              <div>
                <div className="font-extrabold text-2xl tracking-tight text-white group-hover:text-emerald-200 transition-colors">
                  Nagar Sahayata
                </div>

                <div className="text-[10px] text-emerald-300 font-light tracking-widest uppercase">
                  Government of Jharkhand
                </div>
              </div>
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
              <Link
                to="/"
                className="text-emerald-100/80 hover:text-white transition-colors"
              >
                Home
              </Link>

              <Link
                to="/login"
                className="text-emerald-100/80 hover:text-white transition-colors"
              >
                Sign In
              </Link>

              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg border border-emerald-400/20 cursor-pointer"
                >
                  Register
                </motion.button>
              </Link>
            </div>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-emerald-400"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-2 bg-emerald-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex flex-col gap-4 font-medium text-emerald-100">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg py-2 hover:text-white"
                >
                  Home
                </Link>

                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg py-2 hover:text-white"
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold">
                    Register
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MAIN SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-5 pt-36 pb-14">
        <OtpModal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          onVerify={handleVerifyOtp}
          email={email}
          title="Verify Your Email"
          description="Please enter the OTP sent to your email address to complete signup."
          isLoading={isLoading}
        />

        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-14 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="hidden lg:block"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-6">
              <Sparkles size={14} />
              Smart Civic Administration
            </div>

            <h1 className="text-6xl font-black leading-tight tracking-tight">
              Officer
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
                Registration Portal
              </span>
            </h1>

            <p className="mt-6 text-lg text-emerald-100/65 leading-relaxed max-w-xl">
              Join the digital governance ecosystem of Jharkhand and manage
              public grievance resolutions with real-time transparency and smart
              departmental coordination.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-5">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <ShieldCheck className="text-emerald-400 mb-4" size={34} />
                <h3 className="font-bold text-xl mb-2">Secure Access</h3>
                <p className="text-sm text-emerald-100/60 leading-relaxed">
                  Verified officer onboarding with OTP and department-based
                  authorization.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <Building2 className="text-teal-400 mb-4" size={34} />
                <h3 className="font-bold text-xl mb-2">Unified Governance</h3>
                <p className="text-sm text-emerald-100/60 leading-relaxed">
                  Connect departments, field staff, and higher authorities in
                  one portal.
                </p>
              </div>
            </div>
          </motion.div>

          {/* FORM CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl" />

            <div className="relative bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">
              {/* TOP HEADER */}
              <div className="p-8 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-lg">
                    <img
                      src="/government-of-jharkhand.png"
                      alt="logo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  <div>
                    <h2 className="text-3xl font-black tracking-tight">
                      Create Account
                    </h2>

                    <p className="text-emerald-100/50 text-sm mt-1">
                      Officer registration for Nagar Sahayata Portal
                    </p>
                  </div>
                </div>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                {/* INPUT STYLE */}
                {[
                  {
                    icon: User,
                    type: "text",
                    placeholder: "Full Name",
                    value: name,
                    onChange: setName,
                  },

                  {
                    icon: Mail,
                    type: "email",
                    placeholder: "Department Email",
                    value: email,
                    onChange: setEmail,
                  },
                ].map((field, i) => (
                  <div key={i} className="relative group">
                    <field.icon
                      size={18}
                      className="absolute left-4 top-4 text-emerald-300/50 group-focus-within:text-emerald-400 transition-colors"
                    />

                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-emerald-500/40 focus:bg-white/[0.07] outline-none text-white placeholder:text-emerald-100/35 transition-all"
                    />
                  </div>
                ))}

                {/* PASSWORD */}
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-4 top-4 text-emerald-300/50"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-emerald-500/40 outline-none text-white placeholder:text-emerald-100/35"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-emerald-100/40 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {/* ROLE */}
                <div className="relative">
                  <Users
                    size={18}
                    className="absolute left-4 top-4 text-emerald-300/50"
                  />

                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);

                      if (e.target.value === "Higher Authority") {
                        setDepartment("");
                      }
                    }}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-emerald-500/40 outline-none text-white appearance-none cursor-pointer"
                  >
                    <option className="bg-[#062419]" value="">
                      Select Role
                    </option>

                    <option
                      className="bg-[#062419]"
                      value="Higher Authority"
                    >
                      Higher Authority
                    </option>

                    <option className="bg-[#062419]" value="Staff">
                      Staff
                    </option>

                    <option className="bg-[#062419]" value="Junior Staff">
                      Junior Staff
                    </option>
                  </select>
                </div>

                {/* DEPARTMENT */}
                <div className="relative">
                  <Briefcase
                    size={18}
                    className="absolute left-4 top-4 text-emerald-300/50"
                  />

                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    disabled={role === "Higher Authority"}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border outline-none appearance-none transition-all ${
                      role === "Higher Authority"
                        ? "bg-white/[0.03] border-white/5 text-white/30 cursor-not-allowed"
                        : "bg-white/5 border-white/10 text-white cursor-pointer focus:border-emerald-500/40"
                    }`}
                  >
                    <option className="bg-[#062419]" value="">
                      Select Department
                    </option>

                    {civicDepartments.map((dept) => (
                      <option
                        className="bg-[#062419]"
                        key={dept}
                        value={dept}
                      >
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CONTACT */}
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-4 text-emerald-300/50"
                  />

                  <input
                    type="tel"
                    placeholder="Contact Number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-emerald-500/40 outline-none text-white placeholder:text-emerald-100/35"
                  />
                </div>

                {/* EMPLOYEE ID */}
                <div className="relative">
                  <BadgeCheck
                    size={18}
                    className="absolute left-4 top-4 text-emerald-300/50"
                  />

                  <input
                    type="text"
                    placeholder="Employee ID (JH...)"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-emerald-500/40 outline-none text-white placeholder:text-emerald-100/35"
                  />
                </div>

                {/* ADDRESS */}
                <div className="relative sm:col-span-2">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-4 text-emerald-300/50"
                  />

                  <input
                    type="text"
                    placeholder="Official Posting Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-emerald-500/40 outline-none text-white placeholder:text-emerald-100/35"
                  />
                </div>

                {/* SUBMIT */}
                <div className="sm:col-span-2 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                      isLoading
                        ? "bg-white/10 text-white/50 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-900/30"
                    }`}
                  >
                    {isLoading ? (
                      "Verifying Credentials..."
                    ) : (
                      <>
                        Create Officer Account
                        <ArrowUpRight size={20} />
                      </>
                    )}
                  </motion.button>
                </div>

                {/* FOOTER LINKS */}
                <div className="sm:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-3 pt-5 border-t border-white/10 text-sm">
                  <div className="text-emerald-100/50">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      Login here
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-emerald-100/50 hover:text-emerald-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Signup;