

import React, { useEffect, useState, useContext } from "react";
import {
  getAllTrips,
  joinTrip,
  leaveTrip,
  requestToJoin,
  getParticipants,
  getRequests,
  approveRequest,
  rejectRequest,
} from "../services/tripService";
import TripCard from "../components/TripCard";
import ParticipantsModal from "../components/ParticipantsModal";
import ManageRequestsModal from "../components/ManageRequestsModal";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import { removeFavorite, addFavorite, getFavorites } from "../services/tripService";

import { deleteTrip } from "../services/tripService";
import { useLocation } from "react-router-dom";


const AllTrips = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const filterDestination = queryParams.get("destination");
const highlightTripId = queryParams.get("trip");


  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("public");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("none");
  const [favorites, setFavorites] = useState([]);
  const [genderFilter, setGenderFilter] = useState("");

  // modals used for participants & requests (global)
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [participantsList, setParticipantsList] = useState([]);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [requestsList, setRequestsList] = useState([]);
  const [activeTripId, setActiveTripId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [itineraryTrip, setItineraryTrip] = useState(null);
  const [expenseTrip, setExpenseTrip] = useState(null);

  // fetch trips
  const fetchTrips = async () => {
    setLoading(true);
    try {
      const all = await getAllTrips();
      // annotate joined flag for current user
      const withJoined = all.map((t) => {
        const joined =
          t.participants && user
            ? t.participants.some(
                (p) => (p._id || p.id || p).toString() === (user._id || user.id).toString()
              )
            : false;
        return { ...t, joined };
      });
      setTrips(withJoined);
    } catch (err) {
      toast.error("Failed to fetch trips");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [user]);

useEffect(() => {
  if (!highlightTripId || trips.length === 0) return;

  const trip = trips.find(t => t._id === highlightTripId);
  if (!trip) return;

  const creatorId = (trip.creator?._id || "").toString();
  const userId = (user?._id || "").toString();

  // 🔹 Decide correct tab
  if (trip.participants.some(p => (p._id || p).toString() === userId)) {
    setActiveTab("joined");
  } 
  else if (creatorId === userId) {
    setActiveTab("created");
  }
  else if (trip.isPrivate) {
    setActiveTab("private");
  } 
  else {
    setActiveTab("public");
  }
}, [highlightTripId, trips]);

useEffect(() => {
  if (!highlightTripId) return;

  const el = document.getElementById(`trip-${highlightTripId}`);
  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("ring-4", "ring-orange-400");

  setTimeout(() => {
    el.classList.remove("ring-4", "ring-orange-400");
  }, 3000);
}, [activeTab, highlightTripId, trips]);


  // favorites when user opens favorites tab
  useEffect(() => {
    const fetchFavoritesIds = async () => {
      if (!user || activeTab !== "favorites") return;
      try {
        const data = await getFavorites();
        setFavorites(data.map((t) => t._id));
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      }
    };
    fetchFavoritesIds();
  }, [user, activeTab]);

  // actions
  const handleJoin = async (tripId) => {
    try {
      setActionLoading(true);
      await joinTrip(tripId);
      toast.success("Joined successfully");
      fetchTrips();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to join trip";
      toast.warn(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async (tripId) => {
    try {
      if (!window.confirm("Leave this trip?")) return;
      setActionLoading(true);
      await leaveTrip(tripId);
      toast.success("Left the trip");
      await fetchTrips();
    } catch (err) {
      toast.error("Leave failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequest = async (tripId) => {
  try {
    setActionLoading(true);
    await requestToJoin(tripId);
    toast.success("Request sent");

    await fetchTrips();  
  } catch (err) {
    toast.error(err?.response?.data?.message || "Request failed");
  } finally {
    setActionLoading(false);
  }
};


  const handleViewParticipants = async (tripId) => {
    try {
      const data = await getParticipants(tripId);
      setParticipantsList(data || []);
      setParticipantsOpen(true);
    } catch (err) {
      toast.error("Failed to load participants");
    }
  };

  const handleManageRequests = async (tripId) => {
    try {
      const data = await getRequests(tripId);
      setRequestsList(data || []);
      setActiveTripId(tripId);
      setRequestsOpen(true);
    } catch (err) {
      toast.error("Failed to load requests");
    }
  };

  const onApprove = async (userId) => {
    try {
      setActionLoading(true);
      await approveRequest(activeTripId, userId);
      toast.success("Approved");
      const data = await getRequests(activeTripId);
      setRequestsList(data || []);
      fetchTrips();
    } catch (err) {
      toast.error("Approve failed");
    } finally {
      setActionLoading(false);
    }
  };

  const onReject = async (userId) => {
    try {
      setActionLoading(true);
      await rejectRequest(activeTripId, userId);
      toast.success("Rejected");
      const data = await getRequests(activeTripId);
      setRequestsList(data || []);
    } catch (err) {
      toast.error("Reject failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddFavorite = async (tripId) => {
    try {
      const data = await addFavorite(tripId);
      setFavorites((prev) => [...prev, tripId]);
      toast.success(data.message || "Added to favorites");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add favorite");
    }
  };

  const handleRemoveFavorite = async (tripId) => {
    try {
      const data = await removeFavorite(tripId);
      setFavorites((prev) => prev.filter((id) => id !== tripId));
      toast.success(data.message || "Removed from favorites");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove favorite");
    }
  };

  // helpers: started / completed tests
  const hasTripStarted = (trip) => {
    if (!trip?.startTime) return false;
    return new Date() >= new Date(trip.startTime);
  };

  const hasTripCompleted = (trip) => {
    if (!trip?.startTime || !trip?.days) return false;
    const start = new Date(trip.startTime);
    const end = new Date(start);
    end.setDate(start.getDate() + Number(trip.days));
    return new Date() > end;
  };

// 🚀 STEP A — FIRST APPLY DESTINATION FILTER
let filteredByDestination = filterDestination
  ? trips.filter(
      (trip) =>
        trip.destination?.toLowerCase() ===
        filterDestination.toLowerCase()
    )
  : trips;

// 🚀 STEP B — THEN APPLY TAB FILTER ON TOP OF IT
const tabFilteredTrips = filteredByDestination.filter((trip) => {
  const creatorId = (trip.creator?._id || trip.creator?.id || trip.creator)?.toString?.() || "";
  const userId = (user?._id || user?.id)?.toString?.() || "";

  const started = hasTripStarted(trip);
  const completed = hasTripCompleted(trip);

  const isUpcoming = !started && !completed;

  switch (activeTab) {
    case "public":
      return (
    (trip.isPrivate === false || trip.isPrivate === undefined) && 
    isUpcoming &&
    creatorId !== userId &&
    trip.joined !== true     
  );
    case "private":
      return (trip.isPrivate === true && isUpcoming&&trip.joined !== true);

    case "joined":
      return trip.joined === true && isUpcoming;

    case "created":
      return creatorId === userId;

    case "started":
      return started && !completed;

    case "completed":
      return completed&&trip.joined == true;

    case "favorites":
      return favorites.includes(trip._id);

    default:
      return true;
  }
});


  // search within tab
  const searchedTrips = tabFilteredTrips.filter((trip) => {
    const destination = trip.destination?.toLowerCase() || "";
    const creator = trip.creator?.name?.toLowerCase() || "";
    const description = trip.description?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return destination.includes(term) || creator.includes(term) || description.includes(term);
  });

  

let displayTrips = searchTerm.trim() === "" ? tabFilteredTrips : searchedTrips;

// 🚀 If destination filter exists (from ML page), filter here
if (filterDestination) {
  displayTrips = displayTrips.filter(
    (trip) =>
      trip.destination?.toLowerCase() === filterDestination.toLowerCase()
  );
}

  // Apply gender filter
    if (genderFilter) {
      displayTrips = displayTrips.filter(
        (trip) => trip.genderRule === genderFilter
      );
    }


  const safeGetTime = (t) => {
    const raw = t?.startTime ?? t?.date ?? t?.tripDate ?? null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? Infinity : d.getTime();
  };

  const safeGetParticipantsCount = (t) => t?.participants?.length ?? 0;

  if (sortOption === "az") displayTrips = [...displayTrips].sort((a, b) => (a.destination || "").localeCompare(b.destination || ""));
  else if (sortOption === "za") displayTrips = [...displayTrips].sort((a, b) => (b.destination || "").localeCompare(a.destination || ""));
  else if (sortOption === "soonest") displayTrips = [...displayTrips].sort((a, b) => safeGetTime(a) - safeGetTime(b));
  else if (sortOption === "farthest") displayTrips = [...displayTrips].sort((a, b) => safeGetTime(b) - safeGetTime(a));
  else if (sortOption === "mostMembers") displayTrips = [...displayTrips].sort((a, b) => safeGetParticipantsCount(b) - safeGetParticipantsCount(a));
  else if (sortOption === "leastMembers") displayTrips = [...displayTrips].sort((a, b) => safeGetParticipantsCount(a) - safeGetParticipantsCount(b));



const handleDeleteTrip = async (tripId) => {
 

  try {
    await deleteTrip(tripId);
    toast.success("Trip deleted");
    fetchTrips(); // reload trips
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to delete trip");
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-6">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
          <h1 className="text-4xl font-bold text-gray-800">Explore Trips</h1>
          <p className="text-gray-500 text-center sm:text-left">
            Public, Private, Joined, Created, Started & Completed — all at your fingertips.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-6">
          {["public", "private", "joined", "created", "started", "completed", "favorites"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                activeTab === tab ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab === "public" && "Public Trips"}
              {tab === "private" && "Private Trips"}
              {tab === "joined" && "Joined Trips"}
              {tab === "created" && "Created Trips"}
              {tab === "started" && "Started Trips"}
              {tab === "completed" && "Completed Trips"}
              {tab === "favorites" && "Favorites"}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by destination, creator, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="none">Sort By</option>
            <option value="az">Destination A → Z</option>
            <option value="za">Destination Z → A</option>
            <option value="soonest">Soonest Trip</option>
            <option value="farthest">Farthest Trip</option>
            <option value="mostMembers">Most Members</option>
            <option value="leastMembers">Least Members</option>
          </select>

                <select
        value={genderFilter}
        onChange={(e) => setGenderFilter(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white"
      >
        <option value="">Gender Rule</option>
        <option value="female-only">Female Only 🚺</option>
        <option value="gender-equal">Gender Equal ⚖️</option>
        <option value="open">Open to All 🌍</option>
      </select>

        </div>


        {/* Trip Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-20 text-gray-500">Loading trips…</div>
          ) : (
            <>
              {displayTrips.length === 0 ? (
                <div className="col-span-full text-center py-20">No trips found for this category.</div>
              ) : (
                displayTrips.map((trip) => (
                  <div id={`trip-${trip._id}`}>
                  <TripCard
                    key={trip._id}
                    trip={trip}
                    onViewParticipants={handleViewParticipants}
                    onJoin={handleJoin}
                    onRequest={handleRequest}
                     onDelete={handleDeleteTrip}
                    onLeave={handleLeave}
                    currentUserRole={user.role}
                    onManageRequests={handleManageRequests}
                    onToggleFavorite={(tripId) => {
                      if (favorites.includes(tripId)) handleRemoveFavorite(tripId);
                      else handleAddFavorite(tripId);
                    }}
                    favorites={favorites}
                    currentUserId={user?.id || user?._id}
                    currentUserGender={user?.gender}   // ✅ ADD THIS
                    activeTab={activeTab}
                    onOpenItinerary={(trip) => setItineraryTrip(trip)}
                    onOpenExpenses={(trip) => setExpenseTrip(trip)}
                  />
                    </div>
                ))
              )}
            </>
          )}
        </section>
      </div>

    
      <ParticipantsModal
        open={participantsOpen}
        participants={participantsList}
        onClose={() => setParticipantsOpen(false)}
      />

      <ManageRequestsModal
        open={requestsOpen}
        requests={requestsList}
        onClose={() => setRequestsOpen(false)}
        onApprove={onApprove}
        onReject={onReject}
        loading={actionLoading}
      />

      {/* 🌍 GLOBAL ITINERARY MODAL */}
      {itineraryTrip && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-2xl p-6 w-[90%] md:w-[70%] h-[60vh] max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setItineraryTrip(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
            >
              <X size={24} />
            </button>

            <ItinerarySection
              tripId={itineraryTrip._id}
              startTime={itineraryTrip.startTime}
              totalDays={itineraryTrip.days}
              editable={true}
            />
          </div>
        </div>
      )}

      {/* 🌍 GLOBAL EXPENSE MODAL */}
      {expenseTrip && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-2xl p-6 w-[90%] md:w-[70%] h-[60vh] max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setExpenseTrip(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
            >
              <X size={24} />
            </button>

            <ExpenseTracker tripId={expenseTrip._id} />
          </div>
        </div>
      )}

    </div>
  );
};

export default AllTrips;