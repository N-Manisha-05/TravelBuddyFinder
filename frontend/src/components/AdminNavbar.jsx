// src/components/AdminNavbar.js

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Users, Map, LayoutDashboard, ShieldCheck } from "lucide-react"; // Import ShieldCheck

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <LayoutDashboard size={22} /> Admin Dashboard
      </h1>

      <div className="flex items-center gap-6">
        <Link to="/admin" className="hover:text-blue-400">
          Home
        </Link>
        <Link to="/admin/users" className="hover:text-blue-400">
          Users
        </Link>
        {/* Add this link */}
        <Link to="/admin/verification" className="flex items-center gap-1 hover:text-blue-400">
          <ShieldCheck size={18} /> Verification
        </Link>
        <Link to="/admin/trips" className="hover:text-blue-400">
          Trips
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-md hover:bg-red-700"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;