import Trip from "../models/Trip.js";
import Feedback from "../models/Feedback.js";
import User from "../models/User.js";

export const submitFeedback = async (req, res) => {
  try {
    const { tripId, toUserId } = req.params;
    const fromUserId = req.user._id;
    const { rating, comment } = req.body;

    // Basic validation
    if (!["good", "bad"].includes(rating)) {
      return res.status(400).json({ message: "Invalid rating" });
    }
    if (rating === "bad" && (!comment || comment.trim().length < 5)) {
      return res.status(400).json({ message: "Please provide a reason for bad behaviour (min 5 chars)" });
    }

    // Ensure trip exists
    const trip = await Trip.findById(tripId).populate("participants", "_id");
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Ensure trip is completed
    if (!trip.startTime || !trip.days) {
      return res.status(400).json({ message: "Trip doesn't have start or days set" });
    }
    const start = new Date(trip.startTime);
    const end = new Date(start);
    end.setDate(start.getDate() + Number(trip.days));
    if (new Date() <= end) {
      return res.status(400).json({ message: "Feedback allowed only after trip completion" });
    }

    // Ensure both users are participants
    const participantIds = trip.participants.map((p) => p._id.toString());
    if (!participantIds.includes(fromUserId.toString())) {
      return res.status(403).json({ message: "Only trip participants can submit feedback" });
    }
    if (!participantIds.includes(toUserId.toString())) {
      return res.status(400).json({ message: "Target user is not a participant of this trip" });
    }
    if (toUserId.toString() === fromUserId.toString()) {
      return res.status(400).json({ message: "You cannot give feedback about yourself" });
    }

    // Prevent duplicate (the unique index helps but we'll check to return a friendly message)
    const existing = await Feedback.findOne({ trip: tripId, fromUser: fromUserId, toUser: toUserId });
    if (existing) {
      return res.status(400).json({ message: "You have already submitted feedback for this user on this trip" });
    }

    const feedback = await Feedback.create({
      trip: tripId,
      fromUser: fromUserId,
      toUser: toUserId,
      rating,
      comment: comment ? comment.trim() : "",
    });

    return res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (err) {
    // handle unique index duplicate gracefully
    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate feedback" });
    }
    console.error("submitFeedback error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getTripFeedbacks = async (req, res) => {
  try {
    const { tripId } = req.params;
    const feedbacks = await Feedback.find({ trip: tripId }).populate("fromUser", "name email").populate("toUser", "name email");
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
};

export const getMyTripFeedbacks = async (req, res) => {
  try {
    const { tripId } = req.params;
    const myId = req.user._id;
    // feedbacks submitted by current user for this trip
    const feedbacks = await Feedback.find({ trip: tripId, fromUser: myId }).populate("toUser", "name email");
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch your feedbacks" });
  }
};
