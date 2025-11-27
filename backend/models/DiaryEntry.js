import mongoose from "mongoose";

const diaryEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // if you have user authentication
      required: false,
    },
    place: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: false,
    },
    experience: {
      type: String,
      required: true,
    },
    views: {
      type: String,
      required: false,
    },
    photo: {
      type: String, // base64 or image URL
      required: false,
    },
  },
  { timestamps: true }
);

const DiaryEntry = mongoose.model("DiaryEntry", diaryEntrySchema);
export default DiaryEntry;
