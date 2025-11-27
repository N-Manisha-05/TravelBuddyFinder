// // fixFavorites.js
// import dotenv from 'dotenv';
// import connectDB from './config/db.js';
// import User from './models/User.js';

// dotenv.config();
// connectDB(); // connect to MongoDB

// const fixFavorites = async () => {
//   try {
//     const users = await User.find({ favorites: { $exists: false } });
//     console.log(`Found ${users.length} users without favorites`);

//     for (const user of users) {
//       user.favorites = [];
//       await user.save();
//       console.log(`✅ Initialized favorites for ${user.email}`);
//     }

//     console.log("✅ All old users updated");
//     process.exit(0);
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// };

// fixFavorites();



import mongoose from "mongoose";
import dotenv from "dotenv";
import Itinerary from "./models/Itinerary.js";
import connectDB from './config/db.js';
dotenv.config(); // Load .env with MONGO_URI
connectDB();
const updateItineraries = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await Itinerary.updateMany(
      { ended: { $exists: false } },
      { $set: { ended: false } }
    );
    console.log(`✅ Updated ${result.modifiedCount} itineraries with ended=false`);
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error updating itineraries:", err);
    mongoose.connection.close();
  }
};

updateItineraries();
