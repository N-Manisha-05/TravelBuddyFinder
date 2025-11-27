import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "./models/User.js";

import dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    addStatusToExistingUsers();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });



const addStatusToExistingUsers = async () => {
  try {
    // Find and update all users that do not have the 'status' field
    const result = await User.updateMany(
      { status: { $exists: false } },
      { $set: { status: "active" } }
    );

    console.log(`Updated ${result.modifiedCount} users to add 'status: active'`);
    process.exit(0);
  } catch (err) {
    console.error("Error updating users:", err);
    process.exit(1);
  }
};

// Run the script
addStatusToExistingUsers();
