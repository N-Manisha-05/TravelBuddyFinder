// src/services/tripService.js
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/trips`;

// ✅ Get public trips
export const getPublicTrips = async () => {
  try {
    const res = await axios.get(`${API_URL}/public`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error fetching public trips:", error);
    throw error;
  }
};

// ✅ Get all trips
export const getAllTrips = async () => {
  try {
    const res = await axios.get(`${API_URL}/all`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error fetching all trips:", error);
    throw error;
  }
};

// ✅ Create a trip
export const createTrip = async (tripData) => {
  try {
    const res = await axios.post(`${API_URL}/create`, tripData, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
};

// ✅ Join public trip
export const joinTrip = async (tripId) => {
  try {
    const res = await axios.post(`${API_URL}/${tripId}/join`, {}, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error joining trip:", error);
    throw error;
  }
};

// ✅ Leave trip
export const leaveTrip = async (tripId) => {
  try {
    const res = await axios.post(`${API_URL}/${tripId}/leave`, {}, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error leaving trip:", error);
    throw error;
  }
};

// ✅ Request to join private trip
export const requestToJoin = async (tripId) => {
  try {
    const res = await axios.post(`${API_URL}/${tripId}/request`, {}, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Error requesting to join trip:", error);
    throw error;
  }
};

// ✅ Get participants of a trip

export const getParticipants = async (tripId) => {
    const res = await axios.get(`${API_URL}/${tripId}/participants`, {
      withCredentials: true,
    });
    return res.data;
  };
// ✅ Get pending join requests (for trip creator)
export const getRequests = async (tripId) => {
  try {
    const res = await axios.get(`${API_URL}/${tripId}/requests`, { withCredentials: true });

    return res.data;
  } catch (error) {
    console.error("Error fetching join requests:", error);
    throw error;
  }
};

export const approveRequest = async (tripId, userId) => {
  const url = `${API_URL}/${tripId}/requests/${userId}`;
  console.log("➡ approveRequest calling:", url, "body:", { action: "accepted" });
  try {
    const res = await axios.put(url, { action: "accepted" }, { withCredentials: true });
    console.log("✅ approveRequest response:", res.status, res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error approving request:", error, error.response && error.response.data);
    throw error;
  }
};

export const rejectRequest = async (tripId, userId) => {
  const url = `${API_URL}/${tripId}/requests/${userId}`;
  console.log("➡ rejectRequest calling:", url, "body:", { action: "rejected" });
  try {
    const res = await axios.put(url, { action: "rejected" }, { withCredentials: true });
    console.log("✅ rejectRequest response:", res.status, res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error rejecting request:", error, error.response && error.response.data);
    throw error;
  }
};

// Approve or reject join request
export const respondToRequest = async (tripId, userId, action) => {
  try {
    const res = await axios.put(
      `${API_URL}/${tripId}/requests/${userId}`,
      { action },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error responding to join request:", error);
    throw error;
  }
};



// Add favorite
export const addFavorite = async (tripId) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/favorites/add/${tripId}`,
      {},
      { withCredentials: true }
    );
    return res.data; // { message }
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to add favorite");
  }
};

// Remove favorite
export const removeFavorite = async (tripId) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/favorites/remove/${tripId}`,
      {},
      { withCredentials: true }
    );
    return res.data; // { message }
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to remove favorite");
  }
};

// Get all favorites
export const getFavorites = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
      withCredentials: true,
    });
    return res.data; // array of trips
  } catch (err) {
    console.error("Get favorites error:", err);
    return [];
  }
};

export const deleteTrip = async (tripId) => {
  try {
    const res = await axios.delete(`${API_URL}/${tripId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
};
