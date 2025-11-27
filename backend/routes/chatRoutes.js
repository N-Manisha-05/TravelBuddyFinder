import express from "express";
import { sendMessage, getTripMessages } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkBlocked } from "../middleware/checkBlocked.js";


const router = express.Router();

// 🟢 Get all chat messages for a trip
router.get("/:tripId", protect,checkBlocked, getTripMessages);

// 🟢 Send a new message (also triggers Socket.io emit from controller)
router.post("/:tripId", protect,checkBlocked, sendMessage);

// (Optional) Add route to delete or edit messages later
// router.delete("/:tripId/:messageId", protect, deleteMessage);

export default router;