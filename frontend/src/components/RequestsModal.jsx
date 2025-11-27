

import React from "react";

const RequestsModal = ({ open, requests, onClose, onApprove, onReject, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Join Requests</h3>
        {requests.length === 0 ? <p>No requests.</p> : (
          <ul className="space-y-2">
            {requests.map(r => (
              <li key={r._id} className="flex justify-between items-center">
                {r.name} ({r.email})
                <div className="flex gap-2">
                  <button disabled={loading} onClick={() => onApprove(r._id)} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>
                  <button disabled={loading} onClick={() => onReject(r._id)} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
};

export default RequestsModal;
