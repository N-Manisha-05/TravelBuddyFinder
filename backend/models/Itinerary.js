// import mongoose from "mongoose";

// const itinerarySchema = new mongoose.Schema({
//   tripId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Trip",
//     required: true,
//     unique: true, // One itinerary per trip
//   },
//   days: [
//     {
//       title: { type: String, required: true }, // Example: "Day 1 - Sightseeing"
//       activities: [
//         {
//           time: String,
//           activity: String, // Example: "Visit Baga Beach"
//         },
//       ],
//     },
//   ],
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   updatedAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("Itinerary", itinerarySchema);




// models/Itinerary.js
import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true,
    unique: true, // One itinerary per trip
  },
  days: [
    {
      title: { type: String, required: true },
      activities: [
        {
          time: String,
          activity: String,
        },
      ],
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ended: { type: Boolean, default: false }, // ✅ New field
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Itinerary", itinerarySchema);
