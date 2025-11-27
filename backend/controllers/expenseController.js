import Expense from "../models/Expense.js";
import Trip from "../models/Trip.js";

// ---------------- ADD EXPENSE ----------------
export const addExpense = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const { title, amount, date, participants = [] } = req.body;

    if (!title || !amount)
      return res.status(400).json({ message: "Title and amount required" });

    const trip = await Trip.findById(tripId).populate("participants", "_id");
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const tripMembers = trip.participants.map((p) => p._id.toString());

    let finalParticipants = participants.filter((id) =>
      tripMembers.includes(id.toString())
    );

    if (!finalParticipants.includes(req.user._id.toString())) {
      finalParticipants.push(req.user._id.toString());
    }

    const expense = await Expense.create({
      tripId,
      title,
      amount,
      date: date || Date.now(),
      paidBy: req.user._id,
      participants: finalParticipants,
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error("Add Expense Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET EXPENSES ----------------
export const getExpenses = async (req, res) => {
  try {
    const tripId = req.params.tripId;

    const expenses = await Expense.find({ tripId }).populate(
      "paidBy participants",
      "name email"
    );

    const trip = await Trip.findById(tripId).populate(
      "participants",
      "name email"
    );

    res.json({
      expenses,
      allMembers: trip?.participants || [],
    });
  } catch (err) {
    console.error("Get Expenses Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- UPDATE EXPENSE ----------------
export const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { title, amount, date, participants = [] } = req.body;

    const expense = await Expense.findById(expenseId);
    if (!expense)
      return res.status(404).json({ message: "Expense not found" });

    if (expense.paidBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const trip = await Trip.findById(expense.tripId).populate(
      "participants",
      "_id"
    );

    const tripMembers = trip.participants.map((p) => p._id.toString());

    let finalParticipants = participants.filter((id) =>
      tripMembers.includes(id.toString())
    );

    if (!finalParticipants.includes(req.user._id.toString()))
      finalParticipants.push(req.user._id.toString());

    expense.title = title;
    expense.amount = amount;
    expense.date = date;
    expense.participants = finalParticipants;

    await expense.save();

    res.json(expense);
  } catch (err) {
    console.error("Update Expense Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- DELETE EXPENSE ----------------
export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);

    if (!expense)
      return res.status(404).json({ message: "Expense not found" });

    if (expense.paidBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await Expense.findByIdAndDelete(expenseId);

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Delete Expense Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
