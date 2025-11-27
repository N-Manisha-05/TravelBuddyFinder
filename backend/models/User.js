import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "guide"], default: "user" },
    phone: { type: String },
    bio: { type: String },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    // Add these fields
    aadharNumber: { type: String },
    aadharCard: { type: String }, // file path
    verified: { type: Boolean, default: false },

    interests: [{ type: String }],
    travelType: [{ type: String }],
    budgetRange: { type: String },
    favoriteDestinations: [{ type: String }],
    experienceLevel: { type: String },
    language: { type: String },
    avatar: { type: String },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    rejected: {
  type: Boolean,
  default: false
},

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
