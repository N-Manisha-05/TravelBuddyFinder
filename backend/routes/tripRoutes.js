

import express from "express";
import multer from "multer";
import path from "path";

// ✅ Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/trips");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

import {
  createTrip,
  getAllTrips,
  getPublicTrips,
  joinTrip,
  leaveTrip,
  getParticipants,
  getJoinRequests,
  respondToRequest,
  requestToJoinTrip,
  deleteTrip,
} from "../controllers/tripController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkBlocked } from "../middleware/checkBlocked.js";

import { isGuide } from "../middleware/authMiddleware.js";



const router = express.Router();

// router.post("/create", protect, createTrip);
router.post("/create", protect, upload.single("image"), checkBlocked, createTrip);

router.get("/all", protect, getAllTrips);
router.get("/public", getPublicTrips);

router.post("/:tripId/join", protect, checkBlocked, joinTrip);
router.post("/:tripId/leave", protect,checkBlocked, leaveTrip);

router.get("/:tripId/participants", protect, getParticipants);

router.post("/:tripId/request", protect, requestToJoinTrip);
router.get("/:tripId/requests", protect, getJoinRequests);
router.put("/:tripId/requests/:userId", protect, respondToRequest);

router.delete("/:tripId", protect, deleteTrip);



export default router;

