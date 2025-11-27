import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add to favorites
router.post("/add/:tripId", protect, async (req, res) => {
  try {
    const { tripId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.favorites.includes(tripId)) {
      return res.status(400).json({ message: "Trip already in favorites" });
    }

    user.favorites.push(tripId);
    await user.save();
    res.json({ message: "Added to favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from favorites
router.post("/remove/:tripId", protect, async (req, res) => {
  try {
    const { tripId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.favorites.includes(tripId)) {
      return res.status(400).json({ message: "Trip not in favorites" });
    }

    user.favorites = user.favorites.filter((id) => id.toString() !== tripId);
    await user.save();
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all favorites
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
