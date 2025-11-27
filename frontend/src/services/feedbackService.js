import axios from "axios";
const API = "http://localhost:5000/api";

export const submitFeedback = async (tripId, toUserId, payload) => {
  const res = await axios.post(`${API}/feedback/${tripId}/${toUserId}`, payload, {
    withCredentials: true,
  });
  return res.data;
};

export const getMyTripFeedbacks = async (tripId) => {
  const res = await axios.get(`${API}/feedback/my/trip/${tripId}`, {
    withCredentials: true,
  });
  return res.data;
};

export const getTripFeedbacks = async (tripId) => {
  const res = await axios.get(`${API}/feedback/trip/${tripId}`, {
    withCredentials: true,
  });
  return res.data;
};