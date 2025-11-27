import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserPlus, Info } from "lucide-react";

const AdminTrips = () => {
  const [trips, setTrips] = useState([]);
  const [counts, setCounts] = useState({ total: 0, public: 0, private: 0 });
  
  // State for the modals
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // State for guide assignment
  const [guides, setGuides] = useState([]);
  const [selectedGuideId, setSelectedGuideId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Helper to get authorization headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication failed. Please log in again.");
      // You might want to navigate to login here
      return null;
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch all trips
  const fetchTrips = async () => {
    try {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) return;
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/trips`, authHeaders);
      console.log(res.data.trips)
      setTrips(res.data.trips);
      setCounts(res.data.counts);
    } catch (err) {
      console.error("Error fetching trips:", err);
      toast.error("Failed to fetch trips.");
    }
  };

  // Fetch available guides when the assign modal is opened
  const fetchGuides = async () => {
    try {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) return;
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/guides`, authHeaders);
      setGuides(res.data.guides);
    } catch (err) {
      console.error("Error fetching guides:", err);
      toast.error("Failed to fetch available guides.");
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Handler to open the "Assign Guide" modal
  const openAssignModal = (trip, event) => {
    event.stopPropagation(); // Prevents the details modal from opening
    setSelectedTrip(trip);
    fetchGuides(); // Fetch the latest list of guides
    setShowAssignModal(true);
    setSelectedGuideId(""); // Reset selection
  };
  
  // Handler to open the "Details" modal
  const openDetailsModal = (trip) => {
    setSelectedTrip(trip);
    setShowDetailsModal(true);
  };

  // Handler to perform the guide assignment
  const handleAssignGuide = async () => {
    if (!selectedGuideId) {
      return toast.warn("Please select a guide from the list.");
    }
    setIsAssigning(true);
    try {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) return;
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/trips/${selectedTrip._id}/assign-guide`,
        { guideId: selectedGuideId },
        authHeaders
      );
      toast.success("Guide assigned successfully!");
      setShowAssignModal(false);
      await fetchTrips(); // Refresh the trips list to show the new guide
    } catch (err) {
      console.error("Error assigning guide:", err);
      if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Failed to assign guide.");
    }

    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Trips Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* ... stats JSX remains the same ... */}
        <div className="bg-white shadow rounded-lg p-4 flex-1 min-w-[150px]">
          <p className="text-gray-500 font-medium">Total Trips</p>
          <p className="text-2xl font-bold text-gray-800">{counts.total}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex-1 min-w-[150px]">
          <p className="text-gray-500 font-medium">Public Trips</p>
          <p className="text-2xl font-bold text-green-500">{counts.public}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex-1 min-w-[150px]">
          <p className="text-gray-500 font-medium">Private Trips</p>
          <p className="text-2xl font-bold text-red-500">{counts.private}</p>
        </div>
      </div>

      {/* Trips Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-3 text-left">Destination</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Creator</th>
              <th className="p-3 text-left">Assigned Guide</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr
                key={trip._id}
                className="border-b hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="p-3 font-medium text-gray-800">{trip.destination || "Unknown"}</td>
                <td
                  className={`p-3 font-semibold ${
                    trip.isPrivate ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {trip.isPrivate ? "Private" : "Public"}
                </td>
                <td className="p-3 text-gray-700">{trip.creator?.name || "Unknown"}</td>
                <td className="p-3 text-gray-700">
                  {trip.isPrivate ? (
                    <span className="text-gray-400">N/A</span>
                  ) : trip.guide ? (
                    <span className="font-semibold text-blue-600">{trip.guide.name}</span>
                  ) : (
                    <button
                      onClick={(e) => openAssignModal(trip, e)}
                      className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                    >
                      <UserPlus size={16} />
                      Assign
                    </button>
                  )}
                </td>
                <td className="p-3 text-center">
                  <button 
                    onClick={() => openDetailsModal(trip)}
                    className="text-gray-500 hover:text-gray-800"
                    title="View Details"
                  >
                    <Info size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {trips.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No trips found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Trip Details Modal */}
      {showDetailsModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[85vh] overflow-y-auto">

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {selectedTrip.destination || "Trip Details"}
            </h2>

          

            <div className="space-y-3 text-gray-700">

              <p><strong>Start Point:</strong> {selectedTrip.startPoint || "N/A"}</p>
             

              <p>
                <strong>Start Date:</strong>{" "}
                {selectedTrip.startTime ? new Date(selectedTrip.startTime).toDateString() : "N/A"}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {selectedTrip.startTime && selectedTrip.days ? (
                  new Date(
                    new Date(selectedTrip.startTime).setDate(
                      new Date(selectedTrip.startTime).getDate() + Number(selectedTrip.days) - 1
                    )
                  ).toDateString()
                ) : (
                  "N/A"
                )}
              </p>

              <p><strong>Days:</strong> {selectedTrip.days || "N/A"}</p>

            
              <p>
                <strong>Trip Type:</strong>{" "}
                {selectedTrip.isPrivate ? (
                  <span className="text-red-600 font-semibold">Private</span>
                ) : (
                  <span className="text-green-600 font-semibold">Public</span>
                )}
              </p>

              <p>
                <strong>Creator:</strong>{" "}
                {selectedTrip.creator?.name || "Unknown"}  
                {" "}({selectedTrip.creator?.email})
              </p>

              <p>
                <strong>Assigned Guide:</strong>{" "}
                {selectedTrip.guide ? (
                  <>
                    {selectedTrip.guide.name} ({selectedTrip.guide.email})
                  </>
                ) : (
                  <span className="text-gray-500">Not Assigned</span>
                )}
              </p>

              <p>
                <strong>Total Participants:</strong>{" "}
                {selectedTrip.participants?.length || 0}
              </p>

              {selectedTrip.description && (
                <p><strong>Description:</strong> {selectedTrip.description}</p>
              )}

            </div>

            <button
              onClick={() => setShowDetailsModal(false)}
              className="bg-gray-700 text-white px-4 py-2 rounded mt-6 w-full hover:bg-gray-800 transition"
            >
              Close
            </button>

          </div>
        </div>
      )}


      {/* Assign Guide Modal (New) */}
      {showAssignModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Assign Guide</h2>
            <p className="mb-4 text-gray-600">
              Select a guide for the trip to <strong className="text-gray-900">{selectedTrip.destination}</strong>.
            </p>
            <div className="mb-4">
              <label htmlFor="guide-select" className="block text-sm font-medium text-gray-700 mb-1">
                Available Guides
              </label>
              <select
                id="guide-select"
                value={selectedGuideId}
                onChange={(e) => setSelectedGuideId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>-- Select a guide --</option>
                {guides.length > 0 ? (
                  guides.map((guide) => (
                    <option key={guide._id} value={guide._id}>
                      {guide.name} ({guide.email})
                    </option>
                  ))
                ) : (
                  <option disabled>No guides available</option>
                )}
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignGuide}
                disabled={isAssigning}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isAssigning ? "Assigning..." : "Confirm Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrips;

