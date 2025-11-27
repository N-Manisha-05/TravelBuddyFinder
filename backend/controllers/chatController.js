import ChatMessage from "../models/ChatMessage.js";
import Trip from "../models/Trip.js";
import { io } from "../server.js"; // ✅ import socket instance

/**
 * ✅ Send a chat message in a trip group
 * POST /api/chat/:tripId
 */
export const sendMessage = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { message } = req.body;
    const userId = req.user._id; // assuming you're using auth middleware

    // 🔍 Check if trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // 🔒 Check if user is a participant
    const isParticipant = trip.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isParticipant)
      return res.status(403).json({ message: "You are not part of this trip chat" });

    // 💬 Create and save the message
    const newMessage = await ChatMessage.create({
      trip: tripId,
      sender: userId,
      message,
    });

    // 👤 Populate sender details
    const populatedMessage = await newMessage.populate("sender", "name email");

    // 🚀 Emit real-time message via Socket.IO
    io.to(tripId).emit("receiveMessage", {
      _id: populatedMessage._id,
      trip: tripId.toString(),
      sender: populatedMessage.sender,
      message: populatedMessage.message,
      createdAt: populatedMessage.createdAt,
    });

    // ✅ Respond to client (for fallback or confirmation)
    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("🔥 Error in sendMessage:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

/**
 * ✅ Fetch all messages for a trip
 * GET /api/chat/:tripId
 */
export const getTripMessages = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user._id;

    // 🔍 Check if trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // 🔒 Check if user is a participant
    const isParticipant = trip.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isParticipant)
      return res.status(403).json({ message: "You are not part of this trip chat" });

    // 💬 Fetch messages (oldest → newest)
    const messages = await ChatMessage.find({ trip: tripId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("🔥 Error in getTripMessages:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};