import Trip from "../models/Trip.js";

export const getMyAssignedTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ guide: req.user._id })
      .populate('creator', 'name')
      .sort({ startTime: -1 });

    // Filter out completed (if you want only upcoming/ongoing here)
    const now = new Date();
    const assigned = trips.filter(t => {
      if (!t.startTime || !t.days) return true;
      const start = new Date(t.startTime);
      const end = new Date(start);
      end.setDate(start.getDate() + Number(t.days));
      // return trips whose end >= now (upcoming or ongoing)
      return end >= now;
    });

    res.json({ trips: assigned });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET /api/guides/trips/:tripId/participants
export const getTripParticipantsForAttendance = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, guide: req.user._id })
      .populate('participants', 'name email avatar verified aadharNumber')
      .populate('attendance.user', 'name email avatar');

    if (!trip) return res.status(404).json({ message: "Assigned trip not found" });

    // ✅ RETURN THE ENTIRE TRIP OBJECT ALONG WITH THE OTHER DATA
    res.json({ trip, participants: trip.participants, attendance: trip.attendance });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/guides/trips/:tripId/attendance
export const markAttendance = async (req, res) => {
  try {
    const { userId, status } = req.body;

    // 1. Validate the incoming status
    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({ message: "Invalid attendance status provided." });
    }

    // 2. Find the trip and verify the current user is the assigned guide
    const trip = await Trip.findOne({ _id: req.params.tripId, guide: req.user._id });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found or you are not the assigned guide for it." });
    }

    // 3. IMPORTANT: Verify that the user being marked is actually a participant of the trip.
    // This prevents adding non-participants to the attendance list.
    const isParticipant = trip.participants.some(participantId => participantId.equals(userId));
    if (!isParticipant) {
      return res.status(400).json({ message: "This user is not a participant of the trip." });
    }

    // 4. Find the index of the user in the attendance array
    const attendanceIndex = trip.attendance.findIndex(record => record.user.equals(userId));

    // 5. Conditionally update or add the attendance record
    if (attendanceIndex > -1) {
      // User exists in the attendance list, so just update their status
      trip.attendance[attendanceIndex].status = status;
    } else {
      // User is a valid participant but not in the attendance list yet, so add them
      trip.attendance.push({ user: userId, status: status });
    }

    // 6. Save the updated trip document
    const updatedTrip = await trip.save();

    // 7. Send a successful response
    res.json({ 
      message: `Attendance for user marked as ${status}.`, 
      attendance: updatedTrip.attendance 
    });

  } catch (error) {
    console.error("Error in markAttendance:", error);
    res.status(500).json({ message: "Server error while marking attendance." });
  }
};

// GET /api/guides/completed
export const getCompletedTripsForGuide = async (req, res) => {
  try {
    // compute end := startTime + days (end date)
    const now = new Date();
    const trips = await Trip.find({ guide: req.user._id }).populate('creator', 'name');
    
    // filter by completed (end date < now)
    const completed = trips.filter(t => {
      if (!t.startTime || !t.days) return false;
      const start = new Date(t.startTime);
      const end = new Date(start);
      end.setDate(start.getDate() + Number(t.days));
      return end < now;
    });

    res.json({ trips: completed });
  } catch (error) {
    console.error("getCompletedTripsForGuide error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
