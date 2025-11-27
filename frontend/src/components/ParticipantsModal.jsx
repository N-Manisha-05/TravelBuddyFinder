import React from "react";

const ParticipantsModal = ({ open, participants, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-96 max-h-[80vh] overflow-y-auto p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Trip Participants
        </h2>

        {participants.length > 0 ? (
          <ul className="space-y-2">
            {participants.map((p) => (
              <li
                key={p._id}
                className="border p-2 rounded-lg shadow-sm flex flex-col"
              >
                <span className="font-medium">{p.name}</span>
                <span className="text-sm text-gray-600">{p.email}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No participants found.</p>
        )}

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ParticipantsModal;
