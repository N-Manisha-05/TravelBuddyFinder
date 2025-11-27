import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Users, Shield, FileImage } from "lucide-react";
import { Eye, EyeOff} from "lucide-react";
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    aadharNumber: "",
    role: "user", // ✅ Default role is 'user'
  });
  const [aadharCard, setAadharCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("Upload Aadhar Card");
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("File size cannot exceed 2MB");
      }
      setAadharCard(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aadharCard) {
      return toast.warn("Please upload your Aadhar card image.");
    }
    setLoading(true);

    const data = new FormData();
    // Append all key-value pairs from formData
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    data.append("aadhar", aadharCard);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Signup successful! Redirecting to login...", {
          position: "top-center",
        });
        setTimeout(() => navigate("/login"), 2500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white">
            <h1 className="text-3xl font-bold flex justify-center items-center gap-2">
              <UserPlus size={28} /> Create Your Account
            </h1>
            <p className="text-sm mt-2 opacity-90">Join our community of travelers</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            {/* Password */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gender */}
              <div className="relative">
                  <Users className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                      <option value="">Select Gender</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                  </select>
              </div>
              {/* Aadhar Number */}
              <div className="relative">
                <Shield className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input type="text" name="aadharNumber" placeholder="12-Digit Aadhar Number" value={formData.aadharNumber} onChange={handleChange} required maxLength="12" className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {/* Aadhar File Upload */}
            <label htmlFor="aadhar-upload" className="w-full flex items-center gap-3 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50">
              <FileImage className="text-gray-400" size={18} />
              <span className={`text-sm ${aadharCard ? 'text-gray-800' : 'text-gray-500'}`}>{fileName}</span>
              <input id="aadhar-upload" type="file" name="aadharCard" onChange={handleFileChange} required className="hidden" accept="image/*" />
            </label>

            {/* ✅ NEW: Role Selection */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">Register as</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="user">Traveler / User</option>
                <option value="guide">Trip Guide</option>
              </select>
            </div>
            
            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:opacity-90 transition disabled:opacity-50">
              {loading ? "Registering..." : "Create Account"}
            </motion.button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default Register;