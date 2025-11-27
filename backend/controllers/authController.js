import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Trip from "../models/Trip.js"
// // Register
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, gender } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ success: false, message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       gender, 
//     });

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         gender: user.gender, 
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// // Login
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user._id, name: user.name, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // send cookie
//     res
//       .cookie("token", token, {
//         httpOnly: true,
//         secure: false, // set true in production (https)
//         sameSite: "Lax",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       })
//       .json({
//           user: {
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             gender: user.gender, 
//           },
//         });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
//};
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender, aadharNumber,role } = req.body;
    const aadharCard = req.file ? `uploads/aadhar/${req.file.filename}` : null;


    if (!aadharCard) {
      return res.status(400).json({ success: false, message: "Aadhar card is required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
      aadharNumber,
      aadharCard,
      role:role || "user"
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    if (user.status === "blocked") {
      return res.status(403).json({ message: "Your account is blocked" });
    }
    if (user.verified === false){
      return res.status(403).json({ message: "Your account is not verified yet" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/authController.js


// Logout controller
export const logoutUser = async (req, res) => {
  try {
    // If you are using JWT stored in cookies
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only true in production
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

// Returns the logged-in user's data
export const getProfile = async (req, res) => {
  console.log(req.user)
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });

    // Convert Mongoose document to plain JS object
    const userObj = user.toObject();

    // Filter out empty or null fields
    const filteredUser = Object.fromEntries(
      Object.entries(userObj).filter(([key, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
    );
    console.log(filteredUser)
    res.status(200).json({ user: filteredUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      name, email, bio, phone, language, gender,
      budgetRange, experienceLevel, favoriteDestinations, interests,
      aadharNumber, // ✅ Get Aadhar number
    } = req.body;

    // Update standard fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (language !== undefined) user.language = language;
    if (gender !== undefined) user.gender = gender;
    if (budgetRange !== undefined) user.budgetRange = budgetRange;
    if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;

    // If Aadhar number is being updated, trigger re-verification
    if (aadharNumber !== undefined && user.aadharNumber !== aadharNumber) {
      user.aadharNumber = aadharNumber;
      user.verified = false;
    }

    // Handle array fields
    if (favoriteDestinations) {
      user.favoriteDestinations = favoriteDestinations.split(",").map((d) => d.trim());
    }
    if (interests) {
      user.interests = Array.isArray(interests) ? interests : interests.split(",").map(i => i.trim());
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Profile update failed:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};

// ✅ Get logged-in user's favorites
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.status(200).json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

// ✅ Add a trip to favorites
export const addFavorite = async (req, res) => {
  const { tripId } = req.params;
  try {
    const user = await User.findById(req.user.id);

    // initialize if missing
    if (!user.favorites) user.favorites = [];

    if (!user.favorites.includes(tripId)) {
      user.favorites.push(tripId);
      await user.save();
      return res.status(200).json({ message: "Added to favorites" });
    }

    res.status(400).json({ message: "Trip already in favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add favorite" });
  }
};

// ✅ Remove a trip from favorites
export const removeFavorite = async (req, res) => {
  const { tripId } = req.params;
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== tripId.toString()
    );
    await user.save();
    res.status(200).json({ message: "Removed from favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove favorite" });
  }
};
