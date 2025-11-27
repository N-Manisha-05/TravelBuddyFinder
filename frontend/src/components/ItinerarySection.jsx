

// ItinerarySection.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const ItinerarySection = ({ tripId, startTime, totalDays, editable = true }) => {

  const { user } = useContext(AuthContext); // ✅ needed for auth token
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState([]);
  const [tripEnded, setTripEnded] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  const API_BASE_URL = "http://localhost:5000/api";

  axios.defaults.withCredentials = true;

  // ✅ Fetch itinerary on mount when user is available
  useEffect(() => {
    const fetchItinerary = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/itineraries/${tripId}`, {
          withCredentials: true, // ✅ send cookie automatically
        });
        console.log("Fetched itinerary data:", res.data);
        setItinerary(res.data);
        setDays(Array.isArray(res.data.days) ? res.data.days : []);
        setTripEnded(res.data.ended || false);
      } catch (err) {
        console.error("Error fetching itinerary:", err);
        setDays([]);
        toast.error("Failed to fetch itinerary");
      } finally {
        setLoading(false);
      }
    };
  
    fetchItinerary();
  }, [tripId]);
  

  // ✅ Determine trip status
  const getTripStatus = (startDate, totalDays) => {
    if (!startDate || !totalDays) return "notStarted";
    const now = new Date();
    const start = new Date(startDate);
    const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays <= 0) return "notStarted";
    if (diffDays > totalDays) return "completed";
    return "ongoing";
  };

  const tripStatus = getTripStatus(startTime, totalDays);
  const isTripCompleted = tripStatus === "completed";


  // ✅ Add a new day
  const addDay = () => {
    if (!editable) return;

    setDays([...days, { title: `Day ${days.length + 1} - New Plan`, activities: [] }]);
  };

  // ✅ Add activity
  const addActivity = (dayIndex) => {
   if (!editable) return;

    const newDays = [...days];
    newDays[dayIndex].activities.push({ time: "", activity: "" });
    setDays(newDays);
  };

  // ✅ Update activity
  const updateActivity = (dayIndex, actIndex, field, value) => {
    if (!editable) return;

    const newDays = [...days];
    newDays[dayIndex].activities[actIndex][field] = value;
    setDays(newDays);
  };

  // ✅ Remove activity
  const removeActivity = (dayIndex, actIndex) => {
   if (!editable) return;

    const newDays = [...days];
    newDays[dayIndex].activities.splice(actIndex, 1);
    setDays(newDays);
  };

  // ✅ Remove entire day
  const removeDay = (dayIndex) => {
    if (!editable) return;

    const newDays = [...days];
    newDays.splice(dayIndex, 1);
    setDays(newDays);
  };

  // ✅ Save itinerary
  const saveItinerary = async () => {
    try {
      if (!editable) return;

      await axios.post(
        `${API_BASE_URL}/itineraries/${tripId}`,
        { days },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("Itinerary saved successfully!");
    } catch (err) {
      console.error("Error saving itinerary:", err);
      toast.error("Failed to save itinerary");
    }
  };

  // ✅ End itinerary (make it read-only)

  const confirmEndTrip = async () => {
    try {
      if (!editable) return;

      const res = await axios.put(
        `${API_BASE_URL}/itineraries/${tripId}/end`,
        {},
        { withCredentials: true } // send cookies
      );
  
      // ✅ Update local state
      setTripEnded(true);          // mark as ended
      setDays(res.data.itinerary.days || []); // optional: refresh days from backend
  
      setShowEndModal(false);      // close modal
      toast.success("Itinerary ended successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error ending itinerary");
    }
  };
  


  // ✅ Reopen itinerary (for creator only)
  const reopenTrip = async () => {
    try {
      if (!editable) return;

      await axios.put(
        `${API_BASE_URL}/itineraries/${tripId}/reopen`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setTripEnded(false);
      toast.success("Itinerary reopened for editing!");
    } catch (err) {
      console.error("Error reopening itinerary:", err);
      toast.error("Failed to reopen itinerary");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading itinerary...</p>;

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full mt-4">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">🧭 Trip Itinerary</h2>

      {/* ✅ If no itinerary exists */}
      {days.length === 0 ? (
        <p className="text-gray-500 text-center">No itinerary yet.</p>
      ) : (
        <div className="space-y-6">
          {days.map((day, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-700">{day.title}</h3>
                {!tripEnded && (
                  <button
                    onClick={() => removeDay(i)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✖
                  </button>
                )}
              </div>

              {tripEnded ? (
                <ul className="list-disc pl-5 space-y-1">
                  {day.activities.map((act, j) => (
                    <li key={j}>
                      {act.time && <span className="font-medium">{act.time} - </span>}
                      {act.activity}
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  {day.activities.map((activity, j) => (
                    <div
                      key={j}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3"
                    >
                      <input
                        type="text"
                        placeholder="Time"
                        value={activity.time}
                        onChange={(e) =>
                          updateActivity(i, j, "time", e.target.value)
                        }
                        className="border rounded-lg px-3 py-2 w-full sm:w-1/3"
                      />
                      <input
                        type="text"
                        placeholder="Activity"
                        value={activity.activity}
                        onChange={(e) =>
                          updateActivity(i, j, "activity", e.target.value)
                        }
                        className="border rounded-lg px-3 py-2 w-full sm:w-2/3"
                      />
                      <button
                        onClick={() => removeActivity(i, j)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addActivity(i)}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-blue-200 transition"
                  >
                    + Add Activity
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ✅ Buttons (Dynamic based on tripEnded) */}
      <div className="flex flex-wrap gap-3 justify-center mt-6">
        {editable && (
          <>
            <button
              onClick={addDay}
              className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition"
            >
              + Add Day
            </button>
            <button
              onClick={saveItinerary}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Save Itinerary
            </button>
            {(tripStatus === "ongoing" || tripStatus === "completed") && (
              <button
                onClick={() => setShowEndModal(true)}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
              >
                End Itinerary
              </button>
            )}
          </>
        )}

        {/* ✅ Reopen button (only visible when ended) */}
        {tripEnded && !isTripCompleted && (
          <button
            onClick={reopenTrip}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Reopen Itinerary
          </button>
        )}

      </div>

      {/* ✅ End Trip Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm End Itinerary</h3>
            <p className="text-gray-700 mb-6">
              Once you end the itinerary, you won't be able to add, remove, or modify any days or activities.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmEndTrip}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Yes, End Itinerary
              </button>
              <button
                onClick={() => setShowEndModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItinerarySection;