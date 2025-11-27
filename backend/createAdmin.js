import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "./models/User.js";

import dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  try {
    const adminExists = await User.findOne({ email: "admin@travelbuddy.com" });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
