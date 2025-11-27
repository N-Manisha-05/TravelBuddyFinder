import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { submitFeedback, getMyTripFeedbacks } from "../services/feedbackService";
import { toast } from "react-toastify";
import axios from "axios";

const FeedbackModal = ({ open, onClose, tripId, participants = [], currentUserId, onSubmitted }) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [rating, setRating] = useState("good");
  const [comment, setComment] = useState("");
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetch = async () => {
      try {
        const data = await getMyTripFeedbacks(tripId);
        setMyFeedbacks(data || []);
      } catch (err) {
        console.error("Failed to fetch your feedbacks", err);
      }
    };
    fetch();
  }, [open, tripId]);

  // participants: array of user objects (id/_id, name)
  const alreadyGiven = (toUserId) => {
    return myFeedbacks.some((f) => (f.toUser._id || f.toUser).toString() === toUserId.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return toast.warn("Select a teammate");
    if (rating === "bad" && (!comment || comment.trim().length < 5)) {
      return toast.warn("Please provide a reason (min 5 chars) for bad behaviour");
    }
    setSubmitting(true);
    try {
      await submitFeedback(tripId, selectedUser, { rating, comment });
      toast.success("Feedback submitted");
      // update local cached feedbacks so dropdown disables that user
      setMyFeedbacks((prev) => [...prev, { toUser: { _id: selectedUser }, rating, comment }]);
      setSelectedUser("");
      setRating("good");
      setComment("");
      if (onSubmitted) onSubmitted();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  // filter participants to exclude current user
  const others = (participants || []).filter((p) => (p._id || p).toString() !== (currentUserId || "").toString());

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600"><X size={20} /></button>
        <h3 className="text-xl font-semibold mb-3">Give feedback about a teammate</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Teammate</label>
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="w-full border p-2 rounded">
              <option value="">-- choose --</option>
              {others.map((p) => {
                const id = p._id || p;
                const name = p.name || p.email || id;
                const disabled = alreadyGiven(id);
                return (
                  <option key={id} value={id} disabled={disabled}>
                    {name} {disabled ? " (Already rated)" : ""}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex gap-3">
              <label className={`px-3 py-1 border rounded cursor-pointer ${rating === 'good' ? 'bg-green-100' : ''}`}>
                <input type="radio" name="rating" value="good" checked={rating==='good'} onChange={() => setRating('good')} className="hidden" />
                👍 Good
              </label>
              <label className={`px-3 py-1 border rounded cursor-pointer ${rating === 'bad' ? 'bg-red-100' : ''}`}>
                <input type="radio" name="rating" value="bad" checked={rating==='bad'} onChange={() => setRating('bad')} className="hidden" />
                🚨 Bad / Suspicious
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Comment {rating === 'bad' ? "(required)" : "(optional)"}</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border rounded p-2" rows={4} placeholder={rating==='bad' ? "Please explain the issue (harassment, unsafe, etc.)" : "Notes (optional)"} />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded">
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;