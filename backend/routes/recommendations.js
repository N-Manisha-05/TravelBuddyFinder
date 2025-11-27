import express from "express";
import natural from "natural";
import Trip from "../models/Trip.js";
import { protect } from "../middleware/authMiddleware.js";

const { TfIdf } = natural;

const router = express.Router();

router.get("/recommend", protect, async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.interests?.length) {
      return res.status(400).json({ message: "User interests missing" });
    }

    // 🟦 Helper: Check started & completed
    const hasStarted = (trip) => {
      if (!trip.startTime) return false;
      return new Date(trip.startTime) <= new Date();
    };

    const hasCompleted = (trip) => {
      if (!trip.startTime || !trip.days) return false;
      const end = new Date(trip.startTime);
      end.setDate(end.getDate() + Number(trip.days));
      return new Date() > end;
    };

    let trips = await Trip.find({ creator: { $ne: user._id } });

    // remove trips the user already joined
    trips = trips.filter(
    (trip) =>
        !trip.participants?.some(
        (p) => p.toString() === user._id.toString()
        )
    );

    // Keep only upcoming trips
    trips = trips.filter(
    (trip) => !hasStarted(trip) && !hasCompleted(trip)
    );


    const tfidf = new TfIdf();
    const userDoc = user.interests.join(" ").toLowerCase();

    trips.forEach((trip) => {
      const text = `${trip.destination} ${trip.description} ${trip.budget} ${trip.days}`.toLowerCase();
      tfidf.addDocument(text);
    });

    let scoredTrips = trips.map((trip, index) => {
      let score = tfidf.tfidf(userDoc, index);

      // Budget scoring
      if (trip.budget && user.budgetRange) {
        const tripBudget = parseInt(trip.budget);
        const userBudget = parseInt(user.budgetRange);

        if (!isNaN(tripBudget) && !isNaN(userBudget)) {
          const diff = Math.abs(tripBudget - userBudget);
          if (diff <= 2000) score += 0.3;
          else if (diff <= 5000) score += 0.15;
        }
      }

      // Travel type overlap
      if (trip.travelType && user.travelType) {
        const overlap = trip.travelType.filter((t) =>
          user.travelType.includes(t)
        ).length;
        score += overlap * 0.2;
      }

      return { trip, score };
    });

    // Sort by ML score
    scoredTrips.sort((a, b) => b.score - a.score);

    return res.json({
      success: true,
      recommended: scoredTrips.slice(0, 5),
    });

  } catch (err) {
    console.error("❌ Recommendation error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
