// src/pages/AdminVerification.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminVerification = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all unverified users
  const fetchUnverifiedUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming you store the token
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/unverified`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log(res.data)
      setUsers(res.data.users);
    } catch (error) {
      toast.error("Error fetching users for verification");
      console.log("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Verify a user
  const handleVerifyUser = async (id) => {
    if (!window.confirm("Are you sure you want to verify this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}/verify`,
        {}, // No body needed
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Remove the user from the list locally
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User verified successfully!");
    } catch (error) {
      toast.error("Failed to verify user");
      console.error("Error verifying user:", error);
    }
  };

  const handleRejectUser = async (id) => {
  if (!window.confirm("Are you sure? This user will be removed permanently.")) return;

  try {
    const token = localStorage.getItem("token");

    await axios.patch(
     `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}/reject`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      }
    );

    // Remove user from list
    setUsers(users.filter((u) => u._id !== id));
    toast.success("User rejected and removed!");
  } catch (error) {
    toast.error("Failed to reject user");
  }
};


  // Fetch users when the component mounts
  useEffect(() => {
    fetchUnverifiedUsers();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-5">User Aadhar Verification</h1>

      {users.length === 0 ? (
        <p>No users are currently awaiting verification.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left">Name</th>
              <th className="p-3 border text-left">Email</th>
              <th className="p-3 border text-left">Aadhar Number</th>
              <th className="p-3 border text-center">Aadhar Card</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-3 border">{user.name}</td>
                <td className="p-3 border">{user.email}</td>
                <td className="p-3 border">{user.aadharNumber || "N/A"}</td>
                <td className="p-3 border text-center">
                  {user.aadharCard ? (
                    <a
                      href={`${import.meta.env.VITE_BACKEND_URL}/${user.aadharCard.replace(/\\/g, "/")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Image
                    </a>
                  ) : (
                    "Not Provided"
                  )}
                </td>
                <td className="p-3 border text-center">
                  <td className="p-3 border text-center">
  <button
    onClick={() => handleVerifyUser(user._id)}
    className="bg-green-600 text-white px-4 py-2 rounded-md mr-2"
  >
    Verify
  </button>

  <button
    onClick={() => handleRejectUser(user._id)}
    className="bg-red-600 text-white px-4 py-2 rounded-md"
  >
    Reject
  </button>
</td>


                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminVerification;