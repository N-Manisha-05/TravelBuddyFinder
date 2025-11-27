// routes/favorites.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/:tripId", protect, async (req, res) => {
  try {
    const { tripId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.favorites.findIndex((id) => id.toString() === tripId);

    if (index !== -1) {
      // Trip already in favorites → remove it
      user.favorites.splice(index, 1);
      await user.save();
      return res.json({ message: "Removed from favorites", isFavorite: false });
    }

    // Trip not in favorites → add it
    user.favorites.push(tripId);
    await user.save();
    res.json({ message: "Added to favorites", isFavorite: true });
  } catch (err) {
    console.error("Toggle favorite error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;




// ✅ Get all favorites
export const getFavorites = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    console.error("Get favorites error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
