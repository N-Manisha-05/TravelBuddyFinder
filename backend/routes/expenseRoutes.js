import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addExpense, getExpenses, updateExpense, deleteExpense } from "../controllers/expenseController.js";

const router = express.Router();

// Routes
router.post("/:tripId", protect, addExpense);
router.get("/:tripId", protect, getExpenses);
router.put("/:expenseId", protect, updateExpense);
router.delete("/:expenseId", protect, deleteExpense);

export default router;
