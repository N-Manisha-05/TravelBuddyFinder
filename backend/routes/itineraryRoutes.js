

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { saveItinerary, getItinerary, deleteItinerary } from "../controllers/itineraryController.js";
import Itinerary from "../models/Itinerary.js";
import Trip from "../models/Trip.js"; // adjust the path if needed

const router = express.Router();

// Create/update itinerary
router.post("/:tripId", protect, saveItinerary);

// Get itinerary (optional: can be public)
router.get("/:tripId", async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ tripId: req.params.tripId });
    if (!itinerary) return res.status(200).json({ days: [] });
    res.json(itinerary);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching itinerary" });
  }
});

// Delete itinerary
router.delete("/:tripId", protect, deleteItinerary);

// End itinerary
router.put("/:tripId/end", protect, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ tripId: req.params.tripId });
    if (!itinerary) return res.status(404).json({ message: "Itinerary not found" });

    const trip = await Trip.findById(itinerary.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // ✅ Only creator or participant can end the itinerary
    const isParticipant = trip.participants.includes(req.user._id);
    if (itinerary.createdBy.toString() !== req.user._id.toString() && !isParticipant) {
      return res.status(403).json({ message: "Not authorized to end this itinerary" });
    }

    itinerary.ended = true;
    itinerary.updatedAt = Date.now();
    await itinerary.save();

    res.json({ message: "Itinerary marked as ended", itinerary });
  } catch (err) {
    console.error("Error ending itinerary:", err);
    res.status(500).json({ message: "Failed to end itinerary" });
  }
});


// Reopen itinerary
router.put("/:tripId/reopen", protect, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ tripId: req.params.tripId });
    if (!itinerary) return res.status(404).json({ message: "Itinerary not found" });

    const trip = await Trip.findById(itinerary.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // ✅ Only creator or participant can reopen
    const isParticipant = trip.participants.includes(req.user._id);
    if (itinerary.createdBy.toString() !== req.user._id.toString() && !isParticipant) {
      return res.status(403).json({ message: "Not authorized to reopen this itinerary" });
    }

    itinerary.ended = false;
    itinerary.updatedAt = Date.now();
    await itinerary.save();

    res.json({ message: "Itinerary reopened successfully", itinerary });
  } catch (err) {
    console.error("Error reopening itinerary:", err);
    res.status(500).json({ message: "Failed to reopen itinerary" });
  }
});

export default router;
