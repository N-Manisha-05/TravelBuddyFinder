import express from "express";
import { getMyAssignedTrips, getTripParticipantsForAttendance, markAttendance,getCompletedTripsForGuide } from "../controllers/guideController.js";
import { protect, isGuide } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all trips assigned to the currently logged-in guide
router.get("/my-trips", protect, isGuide, getMyAssignedTrips);

// Get the list of participants for a specific trip to take attendance
router.get("/trips/:tripId/participants", protect, isGuide, getTripParticipantsForAttendance);

// Mark a user's attendance for a trip
router.patch("/trips/:tripId/attendance", protect, isGuide, markAttendance);

router.get("/completed", protect, isGuide, getCompletedTripsForGuide);

export default router;