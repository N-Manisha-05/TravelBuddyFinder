// models/Feedback.js
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: String, enum: ["good", "bad"], required: true },
  comment: { type: String }, // required for 'bad' (we will validate server-side)
}, { timestamps: true });

feedbackSchema.index({ trip: 1, fromUser: 1, toUser: 1 }, { unique: true }); // prevents duplicate feedbacks

export default mongoose.model("Feedback", feedbackSchema);
