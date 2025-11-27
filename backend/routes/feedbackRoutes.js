import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { submitFeedback, getMyTripFeedbacks, getTripFeedbacks } from "../controllers/feedbackController.js";

const router = express.Router();

// submit feedback about userId on tripId
router.post("/:tripId/:toUserId", protect, submitFeedback);

// get feedbacks for a trip (all) - used to show existing feedbacks (optionally admin only later)
router.get("/trip/:tripId", protect, getTripFeedbacks);

// get feedbacks submitted by current user for a specific trip (so front can know who they rated)
router.get("/my/trip/:tripId", protect, getMyTripFeedbacks);

export default router;
