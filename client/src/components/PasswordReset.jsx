import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import OtpModal from "./OtpModal";
import { toast } from "react-toastify";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const { forgotPassword, verifyOtp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email");
      return;
    }
    try {
      setIsLoading(true);
      await forgotPassword(email);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setError("");
    setIsLoading(true);
    try {
      await verifyOtp(email, otp, 'reset');
      setVerifiedOtp(otp);
      setOtpVerified(true);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }
    try {
      setIsLoading(true);
      await resetPassword(email, verifiedOtp, newPassword);
      toast.success("Password reset successful. Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F6] relative">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Jharkhand_Rajakiya_Chihna.svg/1200px-Jharkhand_Rajakiya_Chihna.svg.png"
        alt="Watermark"
        className="absolute w-[350px] opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      <OtpModal
        isOpen={otpSent && !otpVerified}
        onClose={() => setOtpSent(false)}
        onVerify={handleVerifyOtp}
        email={email}
        title="Verify Your Email"
        description="Please enter the OTP sent to your email address to reset your password."
        isLoading={isLoading}
      />

      <div className="fixed left-1/2 transform -translate-x-1/2 w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border border-green-400 px-4 sm:px-6 md:px-8 py-5 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-transparent z-10 scale-[1.0]">
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
            Reset Your Password
          </p>
          <div className="w-28 border-t-4 border-orange-500 rounded mt-3"></div>
        </div>

        {!otpVerified ? (
          <form onSubmit={handleSendOtp} noValidate>
            {error && (
              <div className="bg-red-100 text-red-700 border border-red-400 rounded-md p-3 text-center mb-4">
                {error}
              </div>
            )}
            <div className="relative mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-gray-800 placeholder-gray-500 bg-white/90"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-green-700 hover:bg-green-800 text-white text-lg font-semibold rounded-md shadow-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          otpVerified && (
            <form onSubmit={handleResetPassword} noValidate>
              {error && (
                <div className="bg-red-100 text-red-700 border border-red-400 rounded-md p-3 text-center mb-4">
                  {error}
                </div>
              )}
              <div className="relative mb-4">
                <input
                  type="password"
                  placeholder="Enter new password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-gray-800 placeholder-gray-500 bg-white/90"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-green-700 hover:bg-green-800 text-white text-lg font-semibold rounded-md shadow-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
