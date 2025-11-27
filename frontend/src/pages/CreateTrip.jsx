

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialForm = {
  destination: "",
  budget: "",
  days: "",
  isPrivate: false,
  groupLimit: "",
  startPoint: "",
  middleRoutes: "",
  startTime: "",
  genderRule: "open",

};

const CreateTrip = () => {
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const tripCategories = ["Beach", "Spiritual", "Adventure", "Cultural", "Mountains", "City","Desert","Forest","Waterfall","RoadTrips","Camping"];
  const [travelType, setTravelType] = useState([]);

  // ✅ Prefill destination if coming from SpinWheel
  useEffect(() => {
    if (location.state?.destination) {
      setForm((prev) => ({ ...prev, destination: location.state.destination }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  console.log("TOKEN SENT:", token);

  const data = new FormData();
  for (let key in form) {
    data.append(key, form[key]);
  }
  if (image) data.append("image", image);
  data.append("travelType", JSON.stringify(travelType));

  try {
    const res = await axios.post(
     `${import.meta.env.VITE_BACKEND_URL}/api/trips/create`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    toast.success("Trip created!");
    navigate("/all-trips");

  } catch (err) {
    console.log("CREATE TRIP ERROR:", err.response?.data);
    toast.error(err.response?.data?.message || "Failed");
  }
};

const handleTravelType = (e) => {
  const value = e.target.value;

  if (travelType.includes(value)) {
    setTravelType(travelType.filter((t) => t !== value));
  } else {
    setTravelType([...travelType, value]);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-3xl border border-gray-100"
      >
        <h2 className="text-4xl font-bold mb-8 text-center text-indigo-700">
          🌍 Create a New Trip
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inputs remain same */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Destination
              </label>
              <input
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Start Point
              </label>
              <input
                type="text"
                name="startPoint"
                value={form.startPoint}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Budget (₹)
              </label>
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Duration (Days)
              </label>
              <input
                type="number"
                name="days"
                value={form.days}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Middle Routes (comma separated)
            </label>
            <input
              type="text"
              name="middleRoutes"
              value={form.middleRoutes}
              onChange={handleChange}
              placeholder="Hyderabad, Warangal, Vijayawada"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          {/* --- Trip Categories (Travel Type) --- */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Trip Category (Travel Type)
            </label>

            <div className="flex flex-wrap gap-2">
              {tripCategories.map((cat) => (
                <label
                  key={cat}
                  className={`px-3 py-1 border rounded-full cursor-pointer transition ${
                    travelType.includes(cat)
                      ? "bg-blue-500 text-white border-blue-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    value={cat}
                    checked={travelType.includes(cat)}
                    onChange={handleTravelType}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>


          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Group Limit
              </label>
              <input
                type="number"
                name="groupLimit"
                value={form.groupLimit}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Gender Rule</label>
              <select
                name="genderRule"
                value={form.genderRule}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="open">Open to All</option>
                <option value="female-only">Female Only</option>
                <option value="gender-equal">Gender Equal (Equal M/F)</option>
              </select>
            </div>


            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                name="isPrivate"
                checked={form.isPrivate}
                onChange={handleChange}
                className="mr-2 w-5 h-5 text-indigo-600"
              />
              <label className="font-medium text-gray-700">Private Trip</label>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-3 rounded-full font-semibold shadow-lg hover:from-indigo-600 hover:to-blue-700 transition"
          >
            Create Trip ✈️
          </motion.button>

          {message && (
            <p className="text-center font-medium text-green-600 mt-4">
              {message}
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default CreateTrip;