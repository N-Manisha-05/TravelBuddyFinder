import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
  withCredentials: true,
});

export const getTripMessages = async (tripId) => {
  const res = await API.get(`/${tripId}`);
  return res.data.messages;
};

export const sendMessage = async (tripId, message) => {
  const res = await API.post(`/${tripId}`, { message });
  return res.data.data;
};
