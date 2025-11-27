import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/chat",
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
