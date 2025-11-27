// utils/multer.js

import multer from "multer";
import path from "path";
import fs from "fs";

// Helper to ensure folder exists
const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Create storage dynamically
const createStorage = (folderName) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const folderPath = `uploads/${folderName}`;
      ensureFolderExists(folderPath);
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });

// Allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Create uploaders
export const uploadAvatar = multer({
  storage: createStorage("avatars"),
  fileFilter,
});

export const uploadTripImage = multer({
  storage: createStorage("trips"),
  fileFilter,
});

// New uploader for Aadhar cards
export const uploadAadhar = multer({
  storage: createStorage("aadhar"),
  fileFilter,
});