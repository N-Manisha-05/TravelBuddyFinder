// controllers/adminController.js

import User from "../models/User.js";
import Feedback from "../models/Feedback.js";

import Trip from "../models/Trip.js";


// Get all unverified users
export const getUnverifiedUsers = async (req, res) => {
  
  try {
    // Find all users where the 'verified' field is false
   const users = await User.find({ 
  verified: false,
  rejected: { $ne: true }   
});

   
    
    return res.status(200).json({ users });
  } catch (error) {
    // Log the error for debugging purposes on the server
    console.error("Error fetching unverified users:", error);

    // Send an ERROR response and STOP execution
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// Verify a user
export const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.verified = true;
      const updatedUser = await user.save();
      res.json({ message: "User verified", user: updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("error",error.message)
    res.status(500).json({ message: error.message });
  }
};




// Get all users with feedback counts
export const getAllUsers = async (req, res) => {
  try {
    // Fetch ONLY verified users except admins
    const users = await User.find({
      role: { $ne: "admin" },
      verified: true
    }).sort({ createdAt: -1 });

    // For each user, get feedback counts
    const usersWithFeedback = await Promise.all(
      users.map(async (user) => {
        const goodCount = await Feedback.countDocuments({ toUser: user._id, rating: "good" });
        const badCount = await Feedback.countDocuments({ toUser: user._id, rating: "bad" });

        // Auto-block if bad feedback >= 3
        if (badCount >= 3 && user.status !== "blocked") {
          await User.findByIdAndUpdate(user._id, { status: "blocked" });
          user.status = "blocked";
        }

        const userObj = user.toObject();

        return {
          ...userObj,
          feedbackCounts: { good: goodCount, bad: badCount }
        };
      })
    );

    res.json({ users: usersWithFeedback });
  } catch (error) {
    console.error("Error fetching users with feedback:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};


// 📌 Delete user



export const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user details" });
    }
  };
  export const blockUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      if (user.role === "admin") {
        return res.status(400).json({ message: "Cannot block an admin" });
      }
  
      // Toggle status
      user.status = user.status === "active" ? "blocked" : "active";
  
      // Save without triggering required validation errors
      await user.save({ validateBeforeSave: false });
  
      res.status(200).json({
        message: `User is now ${user.status}`,
        user,
      });
    } catch (err) {
      console.error("Block user error:", err);
      res.status(500).json({ message: "Failed to update user status" });
    }
  };
  



  export const getUserFeedback = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Check if user exists (optional but recommended)
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Fetch all feedback for this user
      const feedbacks = await Feedback.find({ toUser: userId }).populate("fromUser", "name email");
  
      res.status(200).json({ feedbacks });
    } catch (err) {
      console.error("Error fetching feedback:", err);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  };



  // controllers/adminController.js

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate("creator", "name email") // correct field name
      .populate("participants", "name email")
      .populate("guide","name email")
      .sort({ createdAt: -1 });

    // Count public vs private
    const publicCount = trips.filter(t => !t.isPrivate).length;  // isPrivate false = public
    const privateCount = trips.filter(t => t.isPrivate).length;

    res.json({
      trips,
      counts: {
        public: publicCount,
        private: privateCount,
        total: trips.length
      }
    });
  } catch (err) {
    console.error("Error fetching trips:", err);
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};


export const getAllGuides = async (req, res) => {
  try {
    const guides = await User.find({ role: 'guide' }).select('name email');
    res.json({ guides });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/trips/:tripId/assign-guide

export const assignGuideToTrip = async (req, res) => {
  try {
    const { guideId } = req.body;
    const tripId = req.params.tripId;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.isPrivate) {
      return res.status(400).json({ message: "Guides can only be assigned to public trips." });
    }

    // -------------------------------
    // 🔍 CHECK IF GUIDE HAS OVERLAP
    // -------------------------------

    // New trip start & end dates
    const newStart = new Date(trip.startTime);
    const newEnd = new Date(newStart);
    newEnd.setDate(newStart.getDate() + Number(trip.days));

    // All trips for guide except this one
    const guideTrips = await Trip.find({
      guide: guideId,
      _id: { $ne: tripId }
    });

    for (const oldTrip of guideTrips) {
      const oldStart = new Date(oldTrip.startTime);
      const oldEnd = new Date(oldStart);
      oldEnd.setDate(oldStart.getDate() + Number(oldTrip.days));

      // Skip completed trips
      if (oldEnd < new Date()) continue;

      // Overlap check
      const isOverlap = newStart <= oldEnd && newEnd >= oldStart;

      if (isOverlap) {
        return res.status(400).json({
          message: `Guide is already assigned to another trip: ${oldTrip.destination} (${oldStart.toDateString()})`
        });
      }
    }

    // -------------------------------
    // 🚀 Assign Guide
    // -------------------------------
    trip.guide = guideId;
    await trip.save();

    res.json({ message: "Guide assigned successfully", trip });

  } catch (error) {
    console.error("Guide assignment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UNVERIFY a user
export const unverifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.verified = false;
    await user.save({ validateBeforeSave: false });

    res.json({ message: "User unverified successfully", user });
  } catch (error) {
    console.error("Unverify error:", error);
    res.status(500).json({ message: "Failed to unverify user" });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Mark rejected
    user.rejected = true;
    await user.save({ validateBeforeSave: false });

    res.json({ message: "User rejected successfully" });
  } catch (error) {
    console.error("Reject error:", error);
    res.status(500).json({ message: "Failed to reject user" });
  }
};
