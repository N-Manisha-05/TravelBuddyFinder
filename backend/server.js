
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import tripRoutes from "./routes/tripRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import http from "http"; // ✅ NEW
import { Server } from "socket.io"; // ✅ NEW
import diaryRoutes from "./routes/diaryRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import safetyRoutes from "./routes/safety.js";
import guideRoutes from "./routes/guideRoutes.js";
import recommendationRoutes from "./routes/recommendations.js";


dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.json());

// ROUTES
app.use("/api/trips", tripRoutes);
app.use("/api", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/diary", diaryRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/guides",guideRoutes)
app.use("/api/expenses", expenseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/safety", safetyRoutes);
app.use("/api", recommendationRoutes);

// Static uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//app.use("/uploads/aadhar", express.static(path.join(__dirname, "uploads/aadhar")));

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO real-time chat
io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  socket.on("joinTrip", (tripId) => {
    socket.join(tripId);
    console.log(`👥 User joined trip chat room: ${tripId}`);
  });

  socket.on("leaveTrip", (tripId) => {
    socket.leave(tripId);
    console.log(`🚪 User left room: ${tripId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});


//  Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));