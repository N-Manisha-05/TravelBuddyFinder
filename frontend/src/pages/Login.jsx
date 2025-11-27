// Signin.js

import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Lock, Mail, LogIn } from "lucide-react";
import { Eye, EyeOff} from "lucide-react";
const Signin = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/login",
        formData,
        { withCredentials: true }
      );

      if (res.data.user) {
       console.log("LOGIN SUCCESS:", res.data);
      
        // Save user ONLY (token is already in cookie)
        localStorage.setItem("user", JSON.stringify(res.data.user));
      
        // Confirm cookie was received
        console.log("COOKIES AFTER LOGIN:", document.cookie);
        localStorage.setItem("token", res.data.token); 
        // Update context
        login(res.data.user);
      
        if (res.data.user.role === "admin") {
          console.log("Redirecting to admin...");
          navigate("/admin/users");
        } else {
          navigate("/profile");
        }
      }
      else {
        setError("Invalid email or password");
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError(err.response.data.message); // Will show "Your account is not verified yet"
      } else {
        setError(err.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white">
          <h1 className="text-3xl font-bold flex justify-center items-center gap-2">
            <LogIn size={28} /> Welcome Back
          </h1>
          <p className="text-sm mt-2 opacity-90">Sign in to continue your journeys</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-100 text-red-600 text-center py-2 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Password</label>

            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-gray-400" size={20} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-11 py-2.5 border border-gray-300 rounded-lg 
                          focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:opacity-90 transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </motion.button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Signin;