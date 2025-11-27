// // src/components/RequestsModal.jsx
// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, Check, XCircle } from "lucide-react";

// const backdrop = { visible: { opacity: 1 }, hidden: { opacity: 0 } };
// const modal = { hidden: { y: 40, opacity: 0, scale: 0.98 }, visible: { y: 0, opacity: 1, scale: 1 } };

// const RequestsModal = ({ open, onClose, requests = [], onApprove, onReject, loading }) => {
//   return (
//     <AnimatePresence>
//       {open && (
//         <motion.div className="fixed inset-0 z-50 flex items-center justify-center" variants={backdrop} initial="hidden" animate="visible" exit="hidden">
//           <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
//           <motion.div variants={modal} initial="hidden" animate="visible" exit="hidden" className="relative z-10 max-w-lg w-full mx-4 bg-white/90 rounded-2xl shadow-xl p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold">Join Requests ({requests.length})</h3>
//               <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X /></button>
//             </div>

//             {requests.length === 0 ? (
//               <p className="text-gray-600">No pending requests.</p>
//             ) : (
//               <div className="space-y-3">
//                 {requests.map((r) => (
//                   <div key={r._id || r.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded shadow-sm">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
//                         <img src={r.avatar ? `http://localhost:5000${r.avatar}` : "https://via.placeholder.com/100"} alt={r.name} className="w-full h-full object-cover" />
//                       </div>
//                       <div>
//                         <div className="font-medium">{r.name}</div>
//                         <div className="text-xs text-gray-500">{r.email}</div>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button disabled={loading} onClick={() => onApprove(r._id || r.id)} className="px-3 py-1 rounded bg-green-500 text-white hover:opacity-90 flex items-center gap-2">
//                         <Check size={14}/> Approve
//                       </button>
//                       <button disabled={loading} onClick={() => onReject(r._id || r.id)} className="px-3 py-1 rounded bg-red-500 text-white hover:opacity-90 flex items-center gap-2">
//                         <XCircle size={14}/> Reject
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };



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
