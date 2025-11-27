
import express from "express";
import { registerUser, loginUser, getProfile, logoutUser, updateProfile, getFavorites, addFavorite, removeFavorite } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import {uploadAvatar, uploadAadhar} from "../utils/multer.js";

const router = express.Router();


router.get("/profile", protect, getProfile);

router.patch("/profile", protect, updateProfile);


router.post(
  "/profile/avatar",
  protect,
  uploadAvatar.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      req.user.avatar = `/uploads/avatars/${req.file.filename}`;
      await req.user.save();

      res.status(200).json({
        message: "Avatar uploaded successfully",
        avatar: req.user.avatar,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Avatar upload failed" });
    }
  }
);
router.post("/profile/aadhar",protect,uploadAadhar.single("aadhar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
   
    req.user.aadharCard = `/uploads/aadhar/${req.file.filename}`;
    req.user.verified = false; // Always requires re-verification
    await req.user.save();
    res.status(200).json({
      message: "Aadhar card uploaded. Verification is pending.",
      aadharCard: req.user.aadharCard,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Aadhar card upload failed" });
  }
});
// Register
router.post("/register", uploadAadhar.single("aadhar"), registerUser);
// Login
router.post("/login", loginUser);
router.post("/logout", logoutUser);


router.get("/favorites", protect, getFavorites);
router.post("/favorites/:tripId", protect, addFavorite);
router.delete("/favorites/:tripId", protect, removeFavorite);
export default router;
