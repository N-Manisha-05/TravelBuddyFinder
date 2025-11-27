import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { Camera, Edit, Save, CheckCircle, AlertTriangle, Shield, Globe, Sparkles, User, Mail, Phone, Languages, Briefcase } from "lucide-react";

// --- Constants ---
const travelOptions = [
  "Beach", "Mountains", "City", "Cultural", "Adventure", "Spiritual", "Desert", "Forest", "Road Trips", "Camping"
];
const experienceLevels = ["Beginner", "Intermediate", "Experienced"];
const budgetRanges = ["5k-10k", "10k-20k", "20k+"];

// --- Main Component ---
const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  // --- State Management ---
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [aadharFile, setAadharFile] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [aadharPreview, setAadharPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", bio: "", interests: [],
    budgetRange: "", favoriteDestinations: "", experienceLevel: "",
    language: "", gender: "", aadharNumber: "",
  });

  // --- API and Data Handlers ---
  const getAuthHeaders = (isMultipart = false) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      navigate("/login");
      return null;
    }
    const headers = { Authorization: `Bearer ${token}` };
    if (isMultipart) {
      headers["Content-Type"] = "multipart/form-data";
    }
    return { headers };
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) return;

      try {
        const res = await axios.get("http://localhost:5000/api/profile", authHeaders);
        const userData = res.data.user;
        setProfile(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          bio: userData.bio || "",
          interests: userData.interests || [],
          budgetRange: userData.budgetRange || "",
          favoriteDestinations: (userData.favoriteDestinations || []).join(", "),
          experienceLevel: userData.experienceLevel || "",
          language: userData.language || "",
          gender: userData.gender || "",
          aadharNumber: userData.aadharNumber || "",
        });
        setAvatarPreview(userData.avatar ? `http://localhost:5000${userData.avatar}` : "/default-avatar.png");
        setAadharPreview(userData.aadharCard ? `http://localhost:5000${userData.aadharCard}` : "");
      } catch (err) {
        toast.error("Failed to load profile.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCheckboxChange = (name, value) => {
    const currentValues = formData[name];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setFormData({ ...formData, [name]: newValues });
  };

  const handleFileChange = (e, fileSetter, previewSetter) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Only image files are allowed!");
    if (file.size > 2 * 1024 * 1024) return toast.error("Max file size is 2MB!");
    fileSetter(file);
    previewSetter(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const updatePromises = [];
      updatePromises.push(axios.patch("http://localhost:5000/api/profile", formData, getAuthHeaders()));

      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", avatarFile);
        updatePromises.push(axios.post("http://localhost:5000/api/profile/avatar", avatarFormData, getAuthHeaders(true)));
      }
      if (aadharFile) {
        const aadharFormData = new FormData();
        // Corrected field name to match backend route
        aadharFormData.append("aadharCard", aadharFile); 
        updatePromises.push(axios.post("http://localhost:5000/api/profile/aadhar", aadharFormData, getAuthHeaders(true)));
      }

      await Promise.all(updatePromises);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred during update.");
    } finally {
      setEditMode(false);
      setIsSaving(false);
      setAvatarFile(null);
      setAadharFile(null);
      setLoading(true);
       const fetchProfile = async () => {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) return;

      try {
        const res = await axios.get("http://localhost:5000/api/profile", authHeaders);
        const userData = res.data.user;
        setProfile(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          bio: userData.bio || "",
          interests: userData.interests || [],
          budgetRange: userData.budgetRange || "",
          favoriteDestinations: (userData.favoriteDestinations || []).join(", "),
          experienceLevel: userData.experienceLevel || "",
          language: userData.language || "",
          gender: userData.gender || "",
          aadharNumber: userData.aadharNumber || "",
        });
        setAvatarPreview(userData.avatar ? `http://localhost:5000${userData.avatar}` : "/default-avatar.png");
        setAadharPreview(userData.aadharCard ? `http://localhost:5000${userData.aadharCard}` : "");
      } catch (err) {
        toast.error("Failed to load profile.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
      await fetchProfile(); // Re-fetch all data to get the latest state
    }
  };

  // --- Render Logic ---
  if (loading) return <div className="pt-24 text-center text-lg text-gray-600">Loading Profile...</div>;
  if (!profile) return <div className="pt-24 text-center text-lg text-red-500">Could not load profile data.</div>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="pt-24 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* --- Profile Header --- */}
          <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0">
                <img src={avatarPreview} alt="Profile Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-blue-400" />
                {editMode && (
                  <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                    <Camera size={16} />
                    <input id="avatar-upload" type="file" onChange={(e) => handleFileChange(e, setAvatarFile, setAvatarPreview)} className="hidden" accept="image/*"/>
                  </label>
                )}
              </div>
              
              {/* Name and Bio Section */}
              <div className="flex-1 w-full text-center sm:text-left">
                {editMode ? (
                  <div className="space-y-2">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full text-2xl font-bold text-gray-800 border p-2 rounded" placeholder="Your Name"/>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full text-gray-600 border p-2 rounded" placeholder="Tell us about your travel passion..."/>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-gray-800">{profile.name}</h2>
                    <p className="text-gray-600 mt-1">{profile.email}</p>
                    <p className="text-gray-500 mt-2">{profile.bio || "No bio added yet."}</p>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex-shrink-0">
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition">
                    <Edit size={16} /> Edit Profile
                  </button>
                ) : (
                  <button onClick={handleUpdate} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition">
                    <Save size={16} /> {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* --- Main Content Grid --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- Left Column (Sidebar) --- */}
            <div className="lg:col-span-1 space-y-8">
              {/* Verification Card */}
              <div className="bg-white shadow-lg rounded-2xl p-6">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-4"><Shield size={20}/> Verification</h3>
                <div className="mb-4">
                  {profile.verified ? (
                    <span className="flex items-center gap-2 text-green-700 font-semibold p-2 bg-green-100 rounded-md"><CheckCircle size={20} /> Verified</span>
                  ) : (
                    <span className="flex items-center gap-2 text-yellow-700 font-semibold p-2 bg-yellow-100 rounded-md"><AlertTriangle size={20} /> Pending</span>
                  )}
                </div>
                {editMode ? (
                  <div className="space-y-4">
                    <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} placeholder="12-digit Aadhar number" className="w-full border p-2 rounded" maxLength="12" />
                    <label htmlFor="aadhar-upload" className="w-full block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer">
                      <input id="aadhar-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, setAadharFile, setAadharPreview)} />
                    </label>
                  </div>
                ) : (
                  <p className="text-gray-600">Aadhar: {profile.aadharNumber ? `**** **** ${profile.aadharNumber.slice(-4)}` : 'Not provided'}</p>
                )}
                {aadharPreview && !editMode && <img src={aadharPreview} alt="Aadhar" className="mt-4 w-full h-auto rounded-lg border"/>}
              </div>

              {/* Quick Info Card */}
              <div className="bg-white shadow-lg rounded-2xl p-6">
                 <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-4"><User size={20}/> Quick Info</h3>
                 <div className="space-y-3">
                    <div className="flex items-center gap-2"><Phone size={16} className="text-gray-400"/> {editMode ? <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" className="w-full border p-2 rounded"/> : <p>{profile.phone || 'Not provided'}</p>}</div>
                    <div className="flex items-center gap-2"><Languages size={16} className="text-gray-400"/> {editMode ? <input type="text" name="language" value={formData.language} onChange={handleChange} placeholder="Languages spoken" className="w-full border p-2 rounded"/> : <p>{profile.language || 'Not provided'}</p>}</div>
                    <div className="flex items-center gap-2"><User size={16} className="text-gray-400"/> {editMode ? <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2 rounded"><option value="">Gender</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option></select> : <p className="capitalize">{profile.gender || 'Not specified'}</p>}</div>
                 </div>
              </div>
            </div>

            {/* --- Right Column (Main Details) --- */}
            <div className="lg:col-span-2 space-y-8">
              {/* Travel Preferences Card */}
              <div className="bg-white shadow-lg rounded-2xl p-6">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-4"><Globe size={20} /> Travel Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Budget Range (per trip)</label>
                    {editMode ? (<select name="budgetRange" value={formData.budgetRange} onChange={handleChange} className="w-full border p-2 rounded mt-1"><option value="">Select Budget</option>{budgetRanges.map(r => <option key={r} value={r}>₹{r}</option>)}</select>) : <p className="font-semibold text-gray-800 mt-1">{profile.budgetRange ? `₹${profile.budgetRange}` : 'Not set'}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Experience Level</label>
                    {editMode ? (<select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full border p-2 rounded mt-1"><option value="">Select Level</option>{experienceLevels.map(l => <option key={l} value={l}>{l}</option>)}</select>) : <p className="font-semibold text-gray-800 mt-1">{profile.experienceLevel || 'Not set'}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Favorite Destinations</label>
                    {editMode ? (<input type="text" name="favoriteDestinations" value={formData.favoriteDestinations} onChange={handleChange} placeholder="e.g., Goa, Manali, Kerala" className="w-full border p-2 rounded mt-1"/>) : <p className="font-semibold text-gray-800 mt-1">{formData.favoriteDestinations || 'None listed'}</p>}
                  </div>
                </div>
              </div>

              {/* Interests Card */}
              <div className="bg-white shadow-lg rounded-2xl p-6">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-4"><Sparkles size={20}/> Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {editMode ? (
                    travelOptions.map((opt) => (
                      <label key={opt} className={`px-3 py-1.5 border rounded-full cursor-pointer transition select-none ${formData.interests.includes(opt) ? "bg-blue-500 text-white border-blue-600" : "bg-gray-100 hover:bg-gray-200"}`}>
                        <input type="checkbox" className="hidden" checked={formData.interests.includes(opt)} onChange={() => handleCheckboxChange("interests", opt)} />
                        {opt}
                      </label>
                    ))
                  ) : (
                   profile.interests && profile.interests.length > 0 ? (
                      profile.interests.map((interest) => (
                        <span key={interest} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">{interest}</span>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No interests selected yet.</p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;