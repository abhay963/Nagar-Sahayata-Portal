import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F6] relative">
      {/* Watermark emblem behind form */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Jharkhand_Rajakiya_Chihna.svg/1200px-Jharkhand_Rajakiya_Chihna.svg.png"
        alt="Watermark"
        className="absolute w-[350px] opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      {/* Form container - fixed position, top offset */}
      <div className="fixed mt-0.5 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border border-green-400 px-6 py-6 z-10">
        {/* Logo & Header */}
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

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-3 left-3 text-green-600" />
            <input
              type="email"
              placeholder="Email address"
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

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white text-lg font-semibold rounded-md shadow-md transition-colors ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800 cursor-pointer'}`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Signup Redirect */}
        <div className="text-center mt-4 text-green-700 font-semibold">
          <p>
            Don&apos;t have an account?{" "}
            <button
              className="text-orange-600 hover:underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up here
            </button>
          </p>
          <p className="mt-2">
            <button
              className="text-green-600 hover:underline cursor-pointer"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
