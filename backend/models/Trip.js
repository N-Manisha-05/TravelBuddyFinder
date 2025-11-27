import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  destination: String,
  startPoint: String,
  middleRoutes: [String],
  startTime: String,
  budget: Number,
  days: Number,
  groupLimit: { type: Number, default: 5, min: 1 }, 
  isPrivate: Boolean,
  image: String,
  genderRule: {
      type: String,
      enum: ["open", "female-only", "gender-equal"],
      default: "open",
    },
    weather: String, // optional
crimeLevel: String, // e.g., "low","medium","high"
crowd: { type: String, default: "normal" } ,// normal/holiday/low
season: String,
 
  description: { type: String, default: "" },


  travelType: [{ type: String }],  // Beach, Spiritual, Adventure etc.

  guide: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null // A trip may not have a guide initially
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  joinRequests: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    },
  ],
  attendance: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { 
        type: String, 
        enum: ["present", "absent"], 
        default: "absent" 
      },
    }
  ],

});

export default mongoose.model("Trip", tripSchema);
