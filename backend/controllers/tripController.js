
import Trip from "../models/Trip.js";

export const createTrip = async (req, res) => {
  try {
    // ⭐ FIX: Convert JSON string to array
    if (req.body.travelType) {
      try {
        req.body.travelType = JSON.parse(req.body.travelType);
      } catch (e) {
        req.body.travelType = [];
      }
    }

    const {
      destination,
      startPoint,
      middleRoutes,
      startTime,
      budget,
      days,
      groupLimit,
      isPrivate,
      genderRule,
    } = req.body;

    if (!destination || !budget || !days) {
      return res.status(400).json({ message: "Destination, budget, and days are required" });
    }

    // ⭐ Auto-description generator
    if (!req.body.description || req.body.description.trim() === "") {
      const categoryDescriptions = {
      Beach: "A refreshing beach trip with waves, sunsets and water fun.",
      Spiritual: "A peaceful spiritual journey including temples and sacred places.",
      Adventure: "An exciting adventure trip with trekking and outdoor thrills.",
      Cultural: "A cultural experience with heritage sites and local traditions.",
      Mountains: "A scenic mountain visit with cool climate and viewpoints.",
      City: "An urban trip full of nightlife, shopping and attractions.",
      Desert: "A unique desert escape with sand dunes, camel rides and starry nights.",
      Forest: "A calm forest retreat surrounded by greenery, wildlife and nature trails.",
      Waterfall: "A refreshing waterfall visit with scenic views, cool mist and relaxing nature vibes.",
      RoadTrips: "A fun road journey filled with scenic routes, music and memorable stops.",
      Camping: "An outdoor camping experience with tents, campfires and peaceful natural surroundings."
    };


      const autoDesc =
        (req.body.travelType || [])
          .map((t) => categoryDescriptions[t] || "")
          .join(" ");

      req.body.description = autoDesc || "A wonderful travel experience.";
    }

    const middleRoutesArray = Array.isArray(middleRoutes)
      ? middleRoutes
      : typeof middleRoutes === "string" && middleRoutes.length > 0
      ? middleRoutes.split(",").map((r) => r.trim())
      : [];

    const image = req.file ? `/uploads/trips/${req.file.filename}` : null;

    const trip = await Trip.create({
      creator: req.user._id,
      destination,
      startPoint,
      middleRoutes: middleRoutesArray,
      startTime,
      budget,
      days,
      groupLimit,
      isPrivate,
      image,
      genderRule,
      travelType: req.body.travelType,   
      description: req.body.description,
      participants: [req.user._id],
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error("❌ Error creating trip:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



//  Get all trips for logged-in user

export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
  .populate("creator", "name email gender")
  .populate("participants", "name email gender")
  .populate("joinRequests.user", "name email gender"); 

    res.json(trips);
  } catch (error) {
    console.error("Error fetching all trips:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all public trips
export const getPublicTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ isPrivate: false })
  .populate("creator", "name email gender")
  .populate("participants", "name email gender");

    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const joinTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
      .populate("participants", "gender");

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    
    if (req.user && req.user.role === "guide") {
      return res.status(403).json({ message: "Guides are not allowed to join trips." });
    }


    if (trip.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: "User already joined" });
    }

    if (trip.participants.length >= trip.groupLimit) {
      return res.status(400).json({ message: "Trip is full. Group limit reached." });
    }

    // FEMALE ONLY
    if (trip.genderRule === "female-only" && req.user.gender !== "female") {
      return res.status(403).json({ message: "This trip is for females only." });
    }

    // GENDER EQUAL — UPDATED RULE
    if (trip.genderRule === "gender-equal") {
      const maleCount = trip.participants.filter(p => p.gender === "male").length;
      const femaleCount = trip.participants.filter(p => p.gender === "female").length;
      const joiningGender = req.user.gender;

      // If equal → allow both
      if (maleCount !== femaleCount) {
        // Females fewer → only female allowed
        if (femaleCount < maleCount && joiningGender !== "female") {
          return res.status(403).json({ message: "Only females can join now to maintain balance." });
        }

        // Males fewer → only male allowed
        if (maleCount < femaleCount && joiningGender !== "male") {
          return res.status(403).json({ message: "Only males can join now to maintain balance." });
        }
      }
    }

    // Add participant
    trip.participants.push(req.user._id);
    await trip.save();

    res.json({ message: "Joined successfully", trip });

  } catch (error) {
    console.error("❌ Error joining trip:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Leave a trip
export const leaveTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

      // at the top of joinTrip / requestToJoinTrip / leaveTrip
      if (req.user && req.user.role === "guide") {
        return res.status(403).json({ message: "Guides are not allowed to join trips." });
      }

    trip.participants = trip.participants.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await trip.save();
    res.json({ message: "Left trip successfully", trip });
  } catch (error) {
    console.error("Error leaving trip:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Request to join trip (for private trips)


// ✅ Get all participants
export const getParticipants = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate("participants", "name email gender");
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    res.json(trip.participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const requestToJoinTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user._id;

    const trip = await Trip.findById(tripId)
      .populate("participants", "gender")
      .populate("creator", "name email avatar");

    // at the top of joinTrip / requestToJoinTrip / leaveTrip
    if (req.user && req.user.role === "guide") {
      return res.status(403).json({ message: "Guides are not allowed to join trips." });
    }

    
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (!trip.isPrivate) {
      return res.status(400).json({ message: "This trip is public, you can join directly." });
    }

    if (trip.participants.length >= trip.groupLimit) {
      return res.status(400).json({ message: "Trip is full. Cannot request join." });
    }

    if (trip.creator._id.toString() === userId.toString()) {
      return res.status(400).json({ message: "You cannot request to join your own trip." });
    }

    const alreadyRequested = trip.joinRequests.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (alreadyRequested) {
      return res.status(400).json({ message: "Request already sent." });
    }

    // ------------------------------------------------
    // ✅ GENDER FILTERS
    // ------------------------------------------------

    // FEMALE-ONLY rule
    if (trip.genderRule === "female-only" && req.user.gender !== "female") {
      return res.status(403).json({ message: "This trip is for females only." });
    }

    // GENDER-EQUAL rule
    if (trip.genderRule === "gender-equal") {
      const maleCount = trip.participants.filter(p => p.gender === "male").length;
      const femaleCount = trip.participants.filter(p => p.gender === "female").length;

      if (req.user.gender === "male" && maleCount >= femaleCount) {
        return res.status(403).json({
          message: "More females must join before another male can request."
        });
      }

      if (req.user.gender === "female" && femaleCount >= maleCount) {
        return res.status(403).json({
          message: "More males must join before another female can request."
        });
      }
    }

    // ------------------------------------------------
    // Add request
    // ------------------------------------------------
    trip.joinRequests.push({ user: userId });
    await trip.save();

    res.status(200).json({ message: "Join request sent successfully." });

  } catch (error) {
    console.error("❌ Error requestToJoinTrip:", error);
    res.status(500).json({ message: error.message });
  }
};



export const getJoinRequests = async (req, res) => {
  try {
    console.log("🔎 getJoinRequests called - params:", req.params, "user:", req.user && req.user._id);
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId)
      .populate("joinRequests.user", "name email avatar");

    if (!trip) {
      console.log("❌ getJoinRequests - trip not found", tripId);
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.creator.toString() !== req.user._id.toString()) {
      console.log("⛔ getJoinRequests - not authorized", { tripCreator: trip.creator.toString(), reqUser: req.user._id.toString() });
      return res.status(403).json({ message: "Not authorized" });
    }

    console.log("✅ getJoinRequests - returning joinRequests count:", trip.joinRequests.length);
    res.status(200).json(trip.joinRequests);
  } catch (error) {
    console.error("🔥 getJoinRequests error:", error);
    res.status(500).json({ message: error.message });
  }
};



export const respondToRequest = async (req, res) => {
  try {
    console.log("🔎 respondToRequest called");

    const { tripId, userId } = req.params;
    const { action } = req.body; // 'accepted' or 'rejected'

    const trip = await Trip.findById(tripId)
      .populate("participants", "gender")
      .populate("joinRequests.user", "gender");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const requestIndex = trip.joinRequests.findIndex(
      (r) => r.user._id.toString() === userId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: "Request not found" });
    }

    // --------------------------------------------
    // ⭐ STEP 7 — GENDER RULE ENFORCEMENT HERE
    // --------------------------------------------

    const requestedUserGender = trip.joinRequests[requestIndex].user.gender;

    // 1️⃣ Female-only trip rule
    if (trip.genderRule === "female-only") {
      if (requestedUserGender !== "female") {
        return res.status(403).json({
          message: "Only female members can be added to this trip."
        });
      }
    }

    // 2️⃣ Gender-equal rule (maintain male = female count)
    if (trip.genderRule === "gender-equal") {
      const maleCount = trip.participants.filter((p) => p.gender === "male").length;
      const femaleCount = trip.participants.filter((p) => p.gender === "female").length;

      // If adding a male breaks balance
      if (requestedUserGender === "male" && maleCount >= femaleCount) {
        return res.status(403).json({
          message: "Cannot approve. More females must join first to maintain gender balance."
        });
      }

      // If adding a female breaks balance
      if (requestedUserGender === "female" && femaleCount >= maleCount) {
        return res.status(403).json({
          message: "Cannot approve. More males must join first to maintain gender balance."
        });
      }
    }

    // --------------------------------------------
    // If REJECTING → simply mark status rejected
    // --------------------------------------------
    if (action === "rejected") {
      trip.joinRequests[requestIndex].status = "rejected";
      await trip.save();
      return res.status(200).json({ message: "Request rejected." });
    }

    // --------------------------------------------
    // If ACCEPTING → add user to participants
    // --------------------------------------------

    if (action === "accepted") {
      // Check group limit
      if (trip.participants.length >= trip.groupLimit) {
        return res.status(400).json({
          message: "Group is full. Cannot approve more users.",
        });
      }

      // Add only once
      if (!trip.participants.includes(userId)) {
        trip.participants.push(userId);
      }

      trip.joinRequests[requestIndex].status = "accepted";
    }

    await trip.save();

    return res.status(200).json({
      message: `Request ${action} successfully`,
      participants: trip.participants,
      joinRequests: trip.joinRequests,
    });

  } catch (error) {
    console.error("🔥 Error in respondToRequest:", error);
    res.status(500).json({ message: error.message });
  }
};
export const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this trip" });
    }

    await Trip.findByIdAndDelete(tripId);

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting trip:", error);
    res.status(500).json({ message: "Server error" });
  }
};