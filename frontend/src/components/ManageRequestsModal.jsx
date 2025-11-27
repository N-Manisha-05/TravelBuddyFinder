// 🧩 src/components/ManageRequestsModal.jsx
import React from "react";
import { XCircle, CheckCircle, User } from "lucide-react";

const ManageRequestsModal = ({
  open,
  requests = [],
  onClose,
  onApprove,
  onReject,
  loading,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[95%] max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
          Manage Join Requests
        </h2>

        {requests.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No pending join requests for this trip.
          </p>
        ) : (
          <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {requests.map((req) => (
              <li
                key={req._id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-3">
                {req.user?.avatar ? (
                    <img
                      src={`http://localhost:5000${req.user.avatar}`}
                      alt={req.user.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <User size={20} className="text-gray-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-green-800">{req.user?.name}</p>
                    <p className="text-sm text-green-500">{req.user?.email}</p>
                  </div>

                </div>

               <div className="flex gap-2 items-center">
                  {req.status === "pending" ? (
                    <>
                      <button
                        onClick={() => onApprove(req.user?._id)}
                        disabled={loading}
                        className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => onReject(req.user?._id)}
                        disabled={loading}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </>
                  ) : req.status === "accepted" ? (
                    <span className="text-green-600 font-semibold">✅ Approved</span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ Rejected</span>
                  )}
                </div>

              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageRequestsModal;
