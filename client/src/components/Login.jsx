import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Building2,
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const result = await login(email, password);

      console.log("✅ Login Success:", result);

      toast.success("Login successful");

      navigate("/");
    } catch (error) {
      console.log("❌ FULL ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Login failed"
      );
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
                to="/signup"
                className="text-emerald-100/80 hover:text-white transition-colors"
              >
                Register
              </Link>

              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg border border-emerald-400/20 cursor-pointer"
                >
                  Sign In
                </motion.button>
              </Link>
            </div>

            {/* MOBILE MENU BUTTON */}
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
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg py-2 hover:text-white"
                >
                  Register
                </Link>

                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold">
                    Sign In
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MAIN SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-5 pt-36 pb-14">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-14 items-center">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="hidden lg:block"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-6">
              <Sparkles size={14} />
              Smart Governance Access
            </div>

            <h1 className="text-6xl font-black leading-tight tracking-tight">
              Secure Officer
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
                Login Portal
              </span>
            </h1>

            <p className="mt-6 text-lg text-emerald-100/65 leading-relaxed max-w-xl">
              Access the Nagar Sahayata officer dashboard and manage citizen
              complaints, civic reports, and departmental operations in
              real-time.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-5">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <ShieldCheck className="text-emerald-400 mb-4" size={34} />

                <h3 className="font-bold text-xl mb-2">
                  Protected Authentication
                </h3>

                <p className="text-sm text-emerald-100/60 leading-relaxed">
                  Secure login system for government officers and authorized
                  staff members.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <Building2 className="text-teal-400 mb-4" size={34} />

                <h3 className="font-bold text-xl mb-2">
                  Unified Civic Platform
                </h3>

                <p className="text-sm text-emerald-100/60 leading-relaxed">
                  Collaborate with departments and resolve civic issues
                  efficiently.
                </p>
              </div>
            </div>
          </motion.div>

          {/* LOGIN CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl" />

            <div className="relative bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">
              {/* HEADER */}
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
                      Welcome Back
                    </h2>

                    <p className="text-emerald-100/50 text-sm mt-1">
                      Login to continue to your officer dashboard
                    </p>
                  </div>
                </div>
              </div>

              {/* FORM */}
              <form
                className="p-8 space-y-5"
                onSubmit={handleSubmit}
              >
                {/* EMAIL */}
                <div className="relative group">
                  <Mail
                    size={18}
                    className="absolute left-4 top-4 text-emerald-300/50 group-focus-within:text-emerald-400 transition-colors"
                  />

                  <input
                    type="email"
                    placeholder="Department Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-emerald-500/40 focus:bg-white/[0.07] outline-none text-white placeholder:text-emerald-100/35 transition-all"
                  />
                </div>

                {/* PASSWORD */}
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-4 top-4 text-emerald-300/50 group-focus-within:text-emerald-400 transition-colors"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-emerald-500/40 focus:bg-white/[0.07] outline-none text-white placeholder:text-emerald-100/35 transition-all"
                  />

                  <button
                    type="button"
                    className="absolute top-4 right-4 text-emerald-100/40 hover:text-white transition-colors cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {/* FORGOT PASSWORD */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-emerald-300 hover:text-emerald-200 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* BUTTON */}
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
                    "Logging in..."
                  ) : (
                    <>
                      Login to Dashboard
                      <ArrowUpRight size={20} />
                    </>
                  )}
                </motion.button>

                {/* FOOTER */}
                <div className="pt-5 border-t border-white/10 text-center text-sm text-emerald-100/50">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    Create Account
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

export default Login;