


import express from "express";
import { getAllUsers, getUserById, blockUser, getUserFeedback, deleteUser, getAllTrips,getUnverifiedUsers,verifyUser,getAllGuides,assignGuideToTrip,unverifyUser ,rejectUser} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/admin.js";

const router = express.Router();
router.get("/guides", protect, adminOnly, getAllGuides);
router.patch("/trips/:tripId/assign-guide", protect, adminOnly, assignGuideToTrip);
router.get("/users",protect,adminOnly, getAllUsers);
router.get("/users/unverified", getUnverifiedUsers);
router.patch("/users/:id/verify", verifyUser);
router.get("/users/:id",protect,adminOnly, getUserById);

// New: block/unblock user
router.patch("/users/:id/block", protect,adminOnly, blockUser);
router.get("/users/:id/feedback", protect,adminOnly,getUserFeedback);
router.delete("/users/:id", deleteUser);
router.get("/trips", getAllTrips);
router.patch("/users/:id/unverify", unverifyUser);

router.patch("/users/:id/reject", protect,adminOnly, rejectUser);



export default router;
