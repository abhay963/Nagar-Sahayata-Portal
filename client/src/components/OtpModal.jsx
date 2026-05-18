import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, ShieldCheck, Sparkles } from "lucide-react";

const OtpModal = ({
  isOpen,
  onClose,
  onVerify,
  email,
  title,
  description,
  isLoading,
}) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await onVerify(otp);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleClose = () => {
    setOtp("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
      >
        {/* Glow Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#10b98122_0%,transparent_45%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-950/95 via-[#062419]/95 to-teal-950/95 shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
        >
          {/* Decorative Blur */}
          <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-teal-500/10 blur-3xl" />

          {/* Header */}
          <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[2px] text-emerald-400">
                <Sparkles size={12} />
                Secure Verification
              </div>

              <h2 className="text-2xl font-black tracking-tight text-white">
                {title}
              </h2>
            </div>

            <button
              onClick={handleClose}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-emerald-200 transition-all hover:border-emerald-500/30 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <X size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="relative px-6 py-7">
            {/* Email Card */}
            <div className="mb-6 flex items-center gap-4 rounded-2xl border border-emerald-500/20 bg-white/5 p-4 backdrop-blur-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                <Mail className="text-white" size={20} />
              </div>

              <div className="overflow-hidden">
                <p className="text-[11px] uppercase tracking-[2px] text-emerald-400 font-bold">
                  Verification Email
                </p>

                <p className="truncate text-sm text-emerald-100/80">
                  {email}
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-emerald-100/60">
              {description}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="mb-3 block text-xs font-bold uppercase tracking-[2px] text-emerald-400">
                  Enter OTP Code
                </label>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 6) {
                      setOtp(value);
                    }
                  }}
                  placeholder="000000"
                  maxLength="6"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center font-mono text-3xl tracking-[10px] text-white outline-none transition-all placeholder:text-emerald-100/20 focus:border-emerald-500/40 focus:bg-white/10 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-300"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Verify Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 px-6 py-4 text-lg font-extrabold tracking-wide text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="relative flex items-center justify-center gap-2">
                  <ShieldCheck size={20} />
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </span>
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-center">
              <p className="text-xs leading-relaxed text-emerald-100/40">
                OTP expires in{" "}
                <span className="font-bold text-emerald-400">
                  5 minutes
                </span>
                . Didn’t receive the code? Check your spam folder or try again.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OtpModal;