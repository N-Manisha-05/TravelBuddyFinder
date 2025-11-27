import axios from "axios";

const API_URL =`${import.meta.env.VITE_BACKEND_URL}/api/auth`;

// Register user
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login user
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data; // returns { token, user }
};


// src/services/userService.js



// Base URL
const API_URLL = `${import.meta.env.VITE_BACKEND_URL}/api/favorites`;

// ✅ Get all favorites for logged-in user
export const  getUserFavorites = async () => {
  const res = await axios.get(API_URLL, { withCredentials: true });
  return res.data;
};

// ✅ Add a favorite
export const addFavorite = async (tripId) => {
  try {
    const res = await axios.post(
     `${import.meta.env.VITE_BACKEND_URL}/api/favorites/${tripId}`,
      {}, // no body needed
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Error adding favorite:", err);
    throw err;
  }
};


// ✅ Remove a favorite
export const removeFavorite = async (tripId) => {
  if (!tripId) throw new Error("tripId is required");
  const res = await axios.delete(`${API_URLL}/${tripId}`, { withCredentials: true });
  return res.data;
};
