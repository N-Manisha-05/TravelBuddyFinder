import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const ExpenseTracker = ({ tripId, editable = true }) => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allMembers, setAllMembers] = useState([]);

  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    participants: user?._id ? [user._id] : [],
paidBy: user?._id || "",

    date: "",
  });

  const [editingExpenseId, setEditingExpenseId] = useState(null);

  const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/expenses`;

  axios.defaults.withCredentials = true;

  // ---------------- FETCH EXPENSES + MEMBERS ----------------
  const fetchExpenses = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${API_BASE_URL}/${tripId}`);

      setExpenses(res.data.expenses || []);
      setAllMembers(res.data.allMembers || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) fetchExpenses();
  }, [tripId]);

  // ---------------- FORM INPUT HANDLER ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  // ---------------- CHECKBOX HANDLER (FIXED) ----------------
  const toggleParticipant = (id) => {
    let updated = [...newExpense.participants];

    if (updated.includes(id)) {
      updated = updated.filter((x) => x !== id);
    } else {
      updated.push(id);
    }

    // ALWAYS include payer
    if (!updated.includes(user._id)) {
      updated.push(user._id);
    }

    setNewExpense({
      ...newExpense,
      participants: updated,
      paidBy: user._id,
    });
  };

  // ---------------- SUBMIT HANDLER ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingExpenseId) {
       await axios.put(`${API_BASE_URL}/${editingExpenseId}`, {
  ...newExpense,
  participants: newExpense.participants
    .filter((id) => id)
    .map((id) => id.toString()),
  paidBy: user._id.toString(),
});


        toast.success("Expense updated!");
        setEditingExpenseId(null);
      } else {
       await axios.post(`${API_BASE_URL}/${tripId}`, {
  ...newExpense,
  participants: newExpense.participants
    .filter((id) => id)
    .map((id) => id.toString()),
  paidBy: user._id.toString(),
});


        toast.success("Expense added!");
      }

      setNewExpense({
        title: "",
        amount: "",
        date: "",
        participants: [user._id],
        paidBy: user._id,
      });

      fetchExpenses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save expense");
    }
  };

  // ---------------- EDIT HANDLER ----------------
const handleEdit = (expense) => {
  setEditingExpenseId(expense._id);
  setNewExpense({
    title: expense.title,
    amount: expense.amount,
    date: expense.date?.slice(0, 10),
    participants: expense.participants.map((p) => p._id.toString()),
    paidBy: user._id.toString(),
  });
};


  // ---------------- DELETE HANDLER ----------------
  const handleDelete = async (expenseId) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/${expenseId}`);
      toast.success("Expense deleted!");
      fetchExpenses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete expense");
    }
  };

  // ---------------- SETTLEMENT CALCULATION ----------------
  const calculateSettlements = () => {
    const balances = {};

    allMembers.forEach((m) => (balances[m._id] = 0));

    expenses.forEach((exp) => {
      const amount = Number(exp.amount);
      const payer = exp.paidBy?._id;
      const participants = exp.participants.map((p) => p._id);

      const perShare = amount / participants.length;

      balances[payer] += amount;
      participants.forEach((id) => (balances[id] -= perShare));
    });

    const creditors = [];
    const debtors = [];

    Object.entries(balances).forEach(([id, bal]) => {
      if (bal > 0.01) creditors.push({ id, amount: bal });
      if (bal < -0.01) debtors.push({ id, amount: -bal });
    });

    const settlements = [];
    let i = 0,
      j = 0;

    while (i < debtors.length && j < creditors.length) {
      const min = Math.min(debtors[i].amount, creditors[j].amount);

      settlements.push({
        from: debtors[i].id,
        to: creditors[j].id,
        amount: min,
      });

      debtors[i].amount -= min;
      creditors[j].amount -= min;

      if (debtors[i].amount < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }

    return settlements;
  };

  const getUserName = (id) => {
    const m = allMembers.find((x) => x._id === id);
    return m ? m.name : "Unknown";
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full mx-auto text-sm">
      <h2 className="text-lg font-semibold mb-2 text-blue-600 text-center">
        💰 Trip Expenses
      </h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col gap-3 mb-4">
          <input
            type="text"
            name="title"
            placeholder="Expense Title"
            value={newExpense.title}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />

          <input
            type="date"
            name="date"
            value={newExpense.date}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />
        </div>

        {/* PARTICIPANTS */}
        <div className="mt-4 border rounded p-3">
          <h3 className="font-semibold mb-2">Select Participants</h3>

          <div className="grid grid-cols-2 gap-2">
            {allMembers.map((m) => (
              <label key={m._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newExpense.participants.includes(m._id)}
                  onChange={() => toggleParticipant(m._id)}
                />
                <span>{m.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={`mt-4 px-6 py-2 text-white rounded ${
            editingExpenseId ? "bg-yellow-500" : "bg-green-600"
          }`}
        >
          {editingExpenseId ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      {/* EXPENSE LIST */}
      {expenses.map((exp) => (
        <div
          className="border p-3 rounded mb-2 flex justify-between"
          key={exp._id}
        >
          <div>
            <p className="font-semibold">{exp.title}</p>
            <p>₹{exp.amount}</p>

            <p>
              <span className="font-semibold text-blue-600">Paid By:</span>{" "}
              {exp.paidBy?.name || "Unknown"}
            </p>

            <p>
              <span className="font-semibold text-green-600">Participants:</span>{" "}
              {exp.participants.map((p) => p.name).join(", ") || "None"}
            </p>
          </div>


          {editable && exp.paidBy?._id === user._id && (
            <div className="flex gap-3">
              <button onClick={() => handleEdit(exp)}>✏️</button>
              <button onClick={() => handleDelete(exp._id)}>🗑️</button>
            </div>
          )}
        </div>
      ))}

      {/* SETTLEMENTS */}
      <h3 className="font-semibold mt-4">Settlements</h3>
      {calculateSettlements().map((s, i) => (
        <p key={i}>
          {getUserName(s.from)} → {getUserName(s.to)} : ₹{s.amount.toFixed(2)}
        </p>
      ))}
    </div>
  );
};

export default ExpenseTracker;





