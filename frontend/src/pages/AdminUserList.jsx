import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // modal user
  const [showModal, setShowModal] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setUsers(res.data.users);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Fetch user details for modal
  const fetchUserDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      setSelectedUser(res.data.user);
      setShowModal(true);
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  };

  // Block/Unblock user
  const toggleBlockUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:5000/api/admin/users/${id}/block`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setUsers(users.map((u) => (u._id === id ? res.data.user : u)));
    } catch (err) {
      console.error("Failed to block/unblock user", err);
    }
  };

  // Fetch feedback for a user
  const fetchFeedback = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/admin/users/${userId}/feedback`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setFeedbacks(res.data.feedbacks);
      setShowFeedbackModal(true);
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-5">User Management</h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Feedback</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr
              key={u._id}
              className="text-center cursor-pointer hover:bg-gray-100"
              onClick={() => fetchUserDetails(u._id)}
            >
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
              <td
                className="p-2 border cursor-pointer text-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  fetchFeedback(u._id);
                }}
              >
                {u.feedbackCounts
                  ? `Good: ${u.feedbackCounts.good} / Bad: ${u.feedbackCounts.bad}`
                  : "N/A"}
              </td>
              {/* Actions */}
              <td className="p-2 border">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBlockUser(u._id);
                  }}
                  className={`px-3 py-1 rounded ${
                    u.status === "blocked" ? "bg-green-500" : "bg-red-500"
                  } text-white`}
                >
                  {u.status === "blocked" ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteUser(u._id);
                  }}
                  className="px-3 py-1 rounded bg-gray-500 text-white ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            {selectedUser.avatar && (
              <img
                src={
                  selectedUser.avatar
                    ? `http://localhost:5000${
                        selectedUser.avatar.startsWith("/")
                          ? selectedUser.avatar
                          : "/" + selectedUser.avatar
                      }`
                    : "/default-avatar.png"
                }
                alt="avatar"
                className="w-24 h-24 rounded-full mt-3"
              />
            )}
            <p>
              <strong>Name:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser.role}
            </p>
            <p>
              <strong>Phone:</strong> {selectedUser.phone || "N/A"}
            </p>
            <p>
              <strong>Bio:</strong> {selectedUser.bio || "N/A"}
            </p>
            <p>
              <strong>Interests:</strong> {selectedUser.interests?.join(", ")}
            </p>
            <p>
              <strong>Travel Type:</strong>{" "}
              {selectedUser.travelType?.join(", ")}
            </p>
            <p>
              <strong>Budget Range:</strong> {selectedUser.budgetRange || "N/A"}
            </p>
            <p>
              <strong>Favorite Destinations:</strong>{" "}
              {selectedUser.favoriteDestinations?.join(", ")}
            </p>
            <p>
              <strong>Experience Level:</strong> {selectedUser.experienceLevel}
            </p>
            <p>
              <strong>Language:</strong> {selectedUser.language}
            </p>
            <p>
              <strong>Gender:</strong> {selectedUser.gender}
            </p>
            <p>
              <strong>Status:</strong> {selectedUser.status}
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">User Feedback</h2>
            {feedbacks.length === 0 ? (
              <p>No feedback yet.</p>
            ) : (
              <ul>
                {feedbacks.map((f) => (
                  <li key={f._id} className="border-b py-2">
                    <p>
                      <strong>From:</strong> {f.fromUser?.name || "Unknown"} (
                      {f.fromUser?.email})
                    </p>
                    <p>
                      <strong>Feedback:</strong> {f.rating}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
