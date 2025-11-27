import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Users, Map, Settings } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 p-8">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-10"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-blue-600 dark:text-blue-400" size={40} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, Admin 👋
          </h1>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          You have full access to manage the Travel Buddy platform.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
          {/* Manage Users */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="p-6 bg-blue-600 text-white rounded-xl shadow-lg cursor-pointer"
          >
            <Users size={32} />
            <h2 className="text-xl font-semibold mt-3">Manage Users</h2>
            <p className="opacity-90 text-sm mt-1">
              View and manage all registered users.
            </p>
          </motion.div>

          {/* Manage Trips */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="p-6 bg-indigo-600 text-white rounded-xl shadow-lg cursor-pointer"
          >
            <Map size={32} />
            <h2 className="text-xl font-semibold mt-3">Manage Trips</h2>
            <p className="opacity-90 text-sm mt-1">
              Edit, approve, or remove trips posted by users.
            </p>
          </motion.div>

         
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
