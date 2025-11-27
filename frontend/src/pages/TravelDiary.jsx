// src/pages/TravelDiary.jsx
import React, { useState, useEffect } from "react";
import DiaryCard from "../components/DiaryCard";

const TravelDiary = () => {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    place: "",
    date: "",
    experience: "",
    views: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 🔹 Controls Add Story modal

  // 🔹 Fetch all existing diary entries when component loads
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/diary");
        const data = await res.json();
        setEntries(data);
      } catch (err) {
        console.error("Error loading stories:", err);
      }
    };
    fetchEntries();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.place || !formData.experience) {
      alert("Please fill in place and experience!");
      return;
    }

    const fd = new FormData();
    fd.append("place", formData.place);
    fd.append("date", formData.date);
    fd.append("experience", formData.experience);
    fd.append("views", formData.views);
    if (photoFile) fd.append("photo", photoFile);

    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:5000/api/diary", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Failed to save entry");

      const newEntry = await res.json();
      setEntries((prev) => [newEntry, ...prev]);
      setIsModalOpen(false); // close modal
      setFormData({ place: "", date: "", experience: "", views: "" });
      setPhotoFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save entry!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative p-6 flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">
        ✈️ Travel Diaries
      </h2>

      {/* 🔹 Display all existing diary entries */}
      <div className="flex flex-wrap gap-6 justify-center w-full max-w-6xl">
        {entries.length === 0 ? (
          <p className="text-gray-600 italic">
            No stories yet. Click "Add New Story" to begin! 🌍
          </p>
        ) : (
          entries.map((entry) => <DiaryCard key={entry._id} entry={entry} />)
        )}
      </div>

      {/* 🔹 Floating Add Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-110"
        title="Add New Story"
      >
        ➕
      </button>

      {/* 🔹 Modal for adding a new story */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg relative">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              Add New Travel Story
            </h3>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleChange}
                placeholder="Place you visited"
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />

              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Describe your travel experience..."
                rows="3"
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              />

              <textarea
                name="views"
                value={formData.views}
                onChange={handleChange}
                placeholder="Share your views or thoughts..."
                rows="2"
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="border border-gray-300 p-2 rounded-lg cursor-pointer focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />

              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border mx-auto"
                />
              )}

              <button
                type="submit"
                disabled={submitting}
                className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save Story"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelDiary;
