// routes/diaryRoutes.js (ensure this exists)
import express from "express";
import multer from "multer";
import path from "path";
import DiaryEntry from "../models/DiaryEntry.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { user, place, date, experience, views } = req.body;
    if (!place || !experience) return res.status(400).json({ message: "Place and experience are required" });

    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;
    const entry = new DiaryEntry({ user, place, date, experience, views, photo: photoPath });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    console.error("Error saving diary entry:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const entries = await DiaryEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
