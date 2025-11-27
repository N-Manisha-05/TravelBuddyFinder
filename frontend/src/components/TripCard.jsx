

import React, { useState } from "react";
import { Users, Calendar, Lock, Globe, Clock, User, X } from "lucide-react";
import ItinerarySection from "./ItinerarySection";
import { Heart } from "lucide-react";
import ExpenseTracker from "../pages/ExpenseTracker";
import FeedbackModal from "./FeedbackModal";
import axios from "axios";

/**
 * TripCard
 * - shows join/leave/request/manage/viewParticipants/chat buttons
 * - shows Itinerary & Expense buttons (and modals) ONLY in started/completed/joined tabs (per activeTab)
 * - Itinerary editable only if trip started && not completed && user is participant.
 * - Expense editable even after completion.
 *
 * Props:
 * - trip, onViewParticipants, onManageRequests, onJoin, onRequest, onLeave,
 * - onToggleFavorite, favorites, activeTab, currentUserId
 */

const TripCard = ({
  trip,
  onViewParticipants,
  onManageRequests,
  onJoin,
  onRequest,
  onLeave,
  onDelete,  
  onToggleFavorite,
  favorites = [],
  activeTab,
  currentUserId,
  currentUserGender, 
  currentUserRole,   
}) => {

  const imageUrl = trip?.image
    ? `${import.meta.env.VITE_BACKEND_URL}${trip.image}`
    : "https://placehold.co/600x400?text=Trip+Photo";

  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [safety, setSafety] = useState(null);
  const [loadingSafety, setLoadingSafety] = useState(false);
  const [safetyError, setSafetyError] = useState(null);
  
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // helpers (robust against participant being array of ids or objects)
  const isUserParticipant = () => {
    if (!trip?.participants || !currentUserId) return false;
    return trip.participants.some(
      (p) => (p._id || p.id || p).toString() === currentUserId.toString()
    );
  };

  const hasTripStarted = () => {
    if (!trip?.startTime) return false;
    return new Date() >= new Date(trip.startTime);
  };

  const hasTripCompleted = () => {
    if (!trip?.startTime || !trip?.days) return false;
    const start = new Date(trip.startTime);
    const end = new Date(start);
    // assume days is integer number of days (if inclusive, this formula aligns with earlier code)
    end.setDate(start.getDate() + Number(trip.days));
    return new Date() > end;
  };

  const calculateTripDay = (startDate, totalDays) => {
    if (!startDate || !totalDays) return "N/A";
    const now = new Date();
    const start = new Date(startDate);
    const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays <= 0) {
      return `${Math.abs(diffDays)} days left`;
    } else if (diffDays > totalDays) {
      return "Completed";
    } else {
      return `Started – Day ${diffDays} / ${totalDays}`;
    }
  };

  // Visibility rules for itinerary & expense: only on tabs joined/started/completed
  const allowModalButtonsOnTab = ["joined", "started", "completed"].includes(
    activeTab
  );

  // Itinerary editable only when started && not completed && user is participant
  const itineraryEditable =
    isUserParticipant() && hasTripStarted() && !hasTripCompleted();

  // Expense editable: user is participant and started or completed
  const expenseEditable = isUserParticipant() && (hasTripStarted() || hasTripCompleted());
  const showJoin = () => (
  <button
    onClick={() => onJoin?.(trip._id)}
    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
  >
    Join
  </button>
);

const showBlocked = (reason) => (
  <button disabled className="px-3 py-1 bg-gray-400 text-white rounded cursor-not-allowed">
    {reason}
  </button>
);

  const calculateSafety = async (crowd = "normal") => {
  try {
    setSafetyError(null);
    setLoadingSafety(true);
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/safety/score`, {
      destination: trip.destination,
      crowd, // optional, you can allow user to choose "holiday" or "normal"
      // month: optional override
    });
    setSafety(res.data);
  } catch (err) {
    console.error(err);
    setSafetyError("Could not compute safety. Try again.");
  } finally {
    setLoadingSafety(false);
  }
};


  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
      {/* IMAGE + labels */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={trip.destination}
          className="w-full h-48 object-cover"
        />

        {/* favorite */}
        <button
          onClick={() => onToggleFavorite?.(trip._id)}
          className="absolute bottom-1 right-5 bg-white/80 p-2 rounded-full shadow-md hover:bg-red-100 transition"
          aria-label="toggle favorite"
        >
          <Heart
            size={20}
            color={favorites?.includes(trip._id) ? "red" : "gray"}
            fill={favorites?.includes(trip._id) ? "red" : "none"}
          />
        </button>

        {/* privacy */}
        <div className="absolute top-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
          {trip.isPrivate ? <Lock size={14} /> : <Globe size={14} />}
          {trip.isPrivate ? "Private" : "Public"}
        </div>

        {/* gender rule */}
        {trip.genderRule && (
          <div className="absolute top-3 left-40 bg-pink-600 text-white px-3 py-1 rounded-full text-sm">
            {trip.genderRule === "female-only" && "Female Only 🚺"}
            {trip.genderRule === "gender-equal" && "Gender Equal ⚖️"}
            {trip.genderRule === "open" && "Open to All 🌍"}
          </div>
        )}


        {/* participants count */}
        <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Users size={14} /> {trip.participants?.length || 0}
        </div>
      </div>

      {/* DETAILS */}
      <div className="p-5">
        <h2 className="text-xl font-bold text-blue-700 mb-1">
          {trip.destination}
        </h2>
        <p className="text-gray-600 text-sm mb-3">{trip.description}</p>

        <div className="flex flex-col gap-2 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-2">
            <User size={15} />
            <span>
              Creator: <b>{trip?.creator?.name || "Unknown"}</b>
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={15} />
            <span>Total Days: <b>{trip.days || "N/A"}</b></span>
          </div>

          <div className="flex items-center gap-2">
            <span>💰 Budget: <b>{trip.budget ? `$${trip.budget}` : "N/A"}</b></span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={15} />
            <span>
              Start Date:{" "}
              {trip.startTime
                ? new Date(trip.startTime).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "Not mentioned"}
            </span>
          </div>

          <div className="text-blue-600 font-medium">
            ⏳ {calculateTripDay(trip.startTime, trip.days)}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-2">
          👥 {trip.participants?.length || 0} / {trip.groupLimit || "∞"} Members
        </p>

        {/* ACTION BUTTONS */}
        
        <div className="flex flex-wrap gap-2">

          {/* ---------- 1) GUIDE RESTRICTION ---------- */}
          {currentUserRole === "guide" ? (
            <button
              disabled
              className="px-3 py-1 bg-gray-400 text-white rounded cursor-not-allowed"
            >
              Guides cannot join trips
            </button>
          ) : (
            <>
              {/* ---------- 2) If user is participant -> show Leave button ---------- */}
              {isUserParticipant() ? (
                <button
                  onClick={() => onLeave?.(trip._id)}
                  disabled={hasTripStarted() || hasTripCompleted()}
                  className={`px-3 py-1 rounded text-white ${
                    hasTripStarted() || hasTripCompleted()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  Leave Trip
                </button>
              ) : (
                <>
                  {/* ---------- 3) Trip Full ---------- */}
                  {trip.participants.length >= trip.groupLimit ? (
                    showBlocked(`Group Full (${trip.groupLimit})`)
                  ) : (
                    <>
                      {/* ---------- 4) Gender rules ---------- */}
                      {(() => {
                        const isPrivate = !!trip.isPrivate;
                        const alreadyRequested = trip.joinRequests?.some(
                          (r) => (r.user?._id || r.user)?.toString() === currentUserId?.toString()
                        );

                        const genders = trip.participants.map(p => p.gender || null);
                        const maleCount = genders.filter(g => g === "male").length;
                        const femaleCount = genders.filter(g => g === "female").length;

                        // Female Only
                        if (trip.genderRule === "female-only") {
                          if (currentUserGender?.toLowerCase() !== "female") return showBlocked("Females Only");
                          return isPrivate
                            ? alreadyRequested
                              ? showBlocked("Request Sent")
                              : <button onClick={() => onRequest?.(trip._id)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Request Join</button>
                            : showJoin();
                        }

                        // Gender Equal
                        if (trip.genderRule === "gender-equal") {
                          const allowed =
                            maleCount === femaleCount ||
                            (currentUserGender === "male" && maleCount < femaleCount) ||
                            (currentUserGender === "female" && femaleCount < maleCount);

                          if (!allowed) return showBlocked("Gender Balanced");

                          return isPrivate
                            ? alreadyRequested
                              ? showBlocked("Request Sent")
                              : <button onClick={() => onRequest?.(trip._id)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Request Join</button>
                            : showJoin();
                        }

                        // Open
                        if (trip.genderRule === "open" || !trip.genderRule) {
                          return isPrivate
                            ? alreadyRequested
                              ? showBlocked("Request Sent")
                              : <button onClick={() => onRequest?.(trip._id)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Request Join</button>
                            : showJoin();
                        }

                        return null;
                      })()}
                    </>
                  )}
                </>
              )}
            </>
          )}

  {/* Other buttons below stay same */}

        {/* DELETE TRIP – only creator can see */}
          {trip.creator?._id?.toString() === currentUserId?.toString() && (
            <button
              onClick={() => setShowDeletePopup(true)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete Trip
            </button>
          )}



          {/* view participants */}
          <button
            onClick={() => onViewParticipants?.(trip._id)}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            View Participants
          </button>
          {/* SAFETY SCORE BUTTON */}
          <button
            onClick={() => {
              if (safety) {
                setSafety(null); // hide card
              } else {
                calculateSafety("normal"); // fetch and show
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {loadingSafety
              ? "Checking..."
              : safety
              ? "Hide Safety Score"
              : "Check Safety"}
          </button>



          {/* Chat - only if participant */}
          {isUserParticipant() && (
            <button
              onClick={() => (window.location.href = `/trip-chat/${trip._id}`)}
              className="px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600"
            >
              Open Chat
            </button>
          )}

          {/* Manage requests - visible to creator only and only when trip not started */}
          {trip.isPrivate &&
            (trip.creator?._id || trip.creator?.id || trip.creator)?.toString() ===
              currentUserId?.toString() &&
            (
              <button
                onClick={() => onManageRequests?.(trip._id)}
                disabled={hasTripStarted()}
                className={`px-3 py-1 rounded text-white ${
                  hasTripStarted() ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                Manage Requests
              </button>
            )}

          {/* ---------- Itinerary & Expense Buttons (ONLY on tabs joined/started/completed) ---------- */}
          {allowModalButtonsOnTab && isUserParticipant() && (hasTripStarted() || hasTripCompleted()) && (
            <>
              {/* Itinerary: view or edit depending on completed */}
              <button
                onClick={() => setShowItineraryModal(true)}
                className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                View Itinerary
              </button>

              {/* Expense */}
              <button
                onClick={() => setShowExpenseModal(true)}
                className="px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
              >
                View Expenses
              </button>
            </>
            
          )}
          {hasTripCompleted() && isUserParticipant() && (
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Give Feedback
            </button>
          )}
          
        </div>
          
        {safety && (
      <div className="mt-3 p-3 bg-gray-50 rounded shadow-sm">
        <div className="text-lg font-semibold text-blue-800">Safety Score: {safety.score} / 100</div>
        <div className="text-sm text-gray-700">Status: {safety.label}</div>
        <div className="text-sm text-gray-600 mt-1">Weather: {safety.weather} — {safety.temperature}°C</div>

        <div className="mt-2 text-xs text-gray-600">
          Breakdown:
          <div>WeatherScore: {safety.components.weatherScore}</div>
          <div>CrimeScore: {safety.components.crimeScore}</div>
          <div>CrowdScore: {safety.components.crowdScore}</div>
          <div>SeasonScore: {safety.components.seasonScore}</div>
        </div>
      </div>
    )}
    { safetyError && <div className="text-sm text-red-500 mt-2">{safetyError}</div> }


        {/* ----------------- ITINERARY MODAL (single copy) ----------------- */}
        {showItineraryModal && (
          <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
            <div
              role="dialog"
              aria-modal="true"
              className="relative bg-white w-[95%] h-[90vh] md:w-[90%] md:h-[90vh] rounded-2xl shadow-2xl overflow-y-auto p-10 transition-all"
            >
              <button
                onClick={() => setShowItineraryModal(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
              >
                <X size={28} />
              </button>

              <ItinerarySection
                tripId={trip._id}
                startTime={trip.startTime}
                totalDays={trip.days}
                editable={itineraryEditable}
              />
            </div>
          </div>
        )}


        {/* ----------------- EXPENSE MODAL (single copy) ----------------- */}
        {showExpenseModal && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
          <div
            role="dialog"
            aria-modal="true"
            className="relative bg-white w-[95%] h-[90vh] md:w-[90%] md:h-[90vh] rounded-2xl shadow-2xl overflow-y-auto p-10 transition-all"
          >
            <button
              onClick={() => setShowExpenseModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
            >
              <X size={28} />
            </button>

            <ExpenseTracker tripId={trip._id} />
          </div>
        </div>
      )}
      {showFeedbackModal && (
        <FeedbackModal
          open={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          tripId={trip._id}
          participants={trip.participants}
          currentUserId={currentUserId}
          onSubmitted={() => setShowFeedbackModal(false)}
        />
      )}


        {/* DELETE CONFIRMATION POPUP */}
            {showDeletePopup && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
                <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm text-center">
                  <h3 className="text-lg font-semibold text-red-600 mb-3">Delete Trip?</h3>
                  <p className="text-gray-700 mb-6">
                    Are you sure you want to delete this trip? This action cannot be undone.
                  </p>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setShowDeletePopup(false)}
                      className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        setShowDeletePopup(false);
                        onDelete?.(trip._id);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}


      </div>
    </div>
  );
};

export default TripCard;