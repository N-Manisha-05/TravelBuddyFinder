import Itinerary from "../models/Itinerary.js";
import Trip from "../models/Trip.js";

// ✅ Create or update itinerary
export const saveItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { days } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Permission check
    const isCreator = trip.creator.toString() === req.user._id.toString();
    const isParticipant = trip.participants.includes(req.user._id);

    if (!isCreator && !isParticipant) {
      return res.status(403).json({ message: "Not authorized to edit itinerary" });
    }

    let itinerary = await Itinerary.findOne({ tripId });

    if (itinerary) {
      itinerary.days = days;
      itinerary.updatedAt = Date.now();
      await itinerary.save();
      return res.json({ message: "Itinerary updated successfully", itinerary });
    } else {
      itinerary = await Itinerary.create({
        tripId,
        days,
        createdBy: req.user._id,
      });
      return res.status(201).json({ message: "Itinerary created successfully", itinerary });
    }
  } catch (error) {
    console.error("❌ Error saving itinerary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get itinerary (public or private logic handled)
export const getItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId).populate("creator participants", "name email");
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const itinerary = await Itinerary.findOne({ tripId });
    if (!itinerary) return res.status(404).json({ message: "No itinerary found for this trip" });

    // Access rules
    if (trip.isPrivate) {
      const isMember =
        trip.participants.some((p) => p._id.toString() === req.user._id.toString()) ||
        trip.creator._id.toString() === req.user._id.toString();
      if (!isMember) {
        return res.status(403).json({ message: "Private trip — access denied" });
      }
    }

    res.json(itinerary);
  } catch (error) {
    console.error("❌ Error fetching itinerary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete itinerary (only trip creator)
export const deleteItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only trip creator can delete itinerary" });
    }

    await Itinerary.findOneAndDelete({ tripId });
    res.json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting itinerary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
