import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowLeft, Check, X, ShieldCheck, ShieldAlert, Info } from 'lucide-react';

/**
 * A reusable modal component to display detailed information about a participant.
 */
const ParticipantModal = ({ user, onClose }) => {
    // Don't render the modal if no user is selected
    if (!user) return null;

    return (
        // The modal backdrop
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            onClick={onClose} // Close modal when clicking the backdrop
        >
            {/* The modal content */}
            <div 
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <div className="flex justify-between items-center pb-3 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Participant Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex flex-col items-center mt-4">
                    <img
                        src={user.avatar ? `http://localhost:5000${user.avatar}` : '/default-avatar.png'}
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 mb-4"
                    />
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="mt-6 border-t pt-4 space-y-3 text-sm">
                    <p className="flex items-center">
                        <Info className="mr-2 text-gray-500" size={16} />
                        <strong>Status:</strong> 
                        <span className={`ml-2 font-medium ${user.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                            {user.verified ? "Verified" : "Pending Verification"}
                        </span>
                    </p>
                    <p className="flex items-center">
                        <ShieldCheck className="mr-2 text-gray-500" size={16} />
                        <strong>Aadhar Number:</strong> {user.aadharNumber || "Not Provided"}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
};


/**
 * The main page component for a guide to take trip attendance.
 */
const TripAttendance = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState(new Map());
    const [loading, setLoading] = useState(true);
    const [updatingIds, setUpdatingIds] = useState(new Set());

    // State for the details modal
    const [selectedParticipant, setSelectedParticipant] = useState(null);

    // Reusable helper for getting auth headers
    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem("token");
        return { headers: { Authorization: `Bearer ${token}` } };
    }, []);

    // Function to fetch all necessary data from the backend
    const fetchAttendanceData = useCallback(async () => {
        try {
            const res = await axios.get(`/api/guides/trips/${tripId}/participants`, getAuthHeaders());
            setTrip(res.data.trip);
            setParticipants(res.data.participants);
            
            // Use a Map for efficient O(1) lookups of attendance status
            const attendanceMap = new Map();
            res.data.attendance.forEach(record => {
                // Ensure record.user is not null before setting
                if (record.user && record.user._id) {
                    attendanceMap.set(record.user._id, record.status);
                }
            });
            setAttendanceRecords(attendanceMap);

        } catch (error) {
            toast.error("Failed to fetch trip data.");
            console.error("Fetch attendance error:", error);
        } finally {
            setLoading(false);
        }
    }, [tripId, getAuthHeaders]);

    // Fetch data on component mount
    useEffect(() => {
        fetchAttendanceData();
    }, [fetchAttendanceData]);
    
    // Handler to update a participant's attendance status
    const handleMarkAttendance = async (userId, status, event) => {
        event.stopPropagation(); // Stop row's onClick from firing when a button is clicked
        setUpdatingIds(prev => new Set(prev).add(userId));
        try {
            await axios.patch(
                `/api/guides/trips/${tripId}/attendance`, 
                { userId, status }, 
                getAuthHeaders()
            );
            
            // Update local state for an immediate UI response
            setAttendanceRecords(prev => new Map(prev).set(userId, status));
            toast.success(`Marked ${status}!`);
        } catch (err) {
            toast.error("Failed to update attendance.");
            console.error("Mark attendance error:", err);
        } finally {
            setUpdatingIds(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        }
    };

    if (loading) {
        return <div className="text-center p-10 text-lg font-semibold text-gray-600">Loading Trip Roster...</div>;
    }

    if (!trip) {
        return <div className="text-center p-10 text-lg font-semibold text-red-600">Trip not found or you are not assigned to it.</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
            
            <ParticipantModal user={selectedParticipant} onClose={() => setSelectedParticipant(null)} />
            
            <div className="max-w-7xl mx-auto">
                <Link to="/guide/my-trips" className="flex items-center gap-2 text-blue-600 hover:underline mb-4">
                    <ArrowLeft size={18} />
                    Back to My Trips
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">Trip Attendance</h1>
                <h2 className="text-xl font-semibold text-gray-600 mb-6">For: {trip.destination}</h2>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">Participant</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">Verification</th>
                                    <th className="p-4 text-center text-sm font-semibold text-gray-600 uppercase">Status</th>
                                    <th className="p-4 text-center text-sm font-semibold text-gray-600 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {participants.length > 0 ? participants.map(p => {
                                    const currentStatus = attendanceRecords.get(p._id) || 'absent';
                                    const isUpdating = updatingIds.has(p._id);
                                    return (
                                        <tr 
                                            key={p._id} 
                                            onClick={() => setSelectedParticipant(p)}
                                            className="hover:bg-blue-50 cursor-pointer transition-colors"
                                        >
                                            <td className="p-4 flex items-center gap-3">
                                                <img 
                                                    src={p.avatar ? `http://localhost:5000${p.avatar}` : '/default-avatar.png'} 
                                                    alt={p.name} 
                                                    className="w-12 h-12 rounded-full object-cover" 
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-800">{p.name}</p>
                                                    <p className="text-sm text-gray-500">{p.email}</p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {p.verified ? (
                                                    <span className="flex items-center gap-1.5 text-sm font-medium text-green-700">
                                                        <ShieldCheck size={16} /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-sm font-medium text-yellow-700">
                                                        <ShieldAlert size={16} /> Pending
                                                    </span>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">Aadhar: {p.aadharNumber || 'N/A'}</p>
                                            </td>
                                            <td className="p-4 text-center">
                                                {currentStatus === 'present' ? (
                                                    <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                                                        Present
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">
                                                        Absent
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button 
                                                        onClick={(e) => handleMarkAttendance(p._id, 'present', e)}
                                                        disabled={isUpdating || currentStatus === 'present'}
                                                        className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Mark as Present"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleMarkAttendance(p._id, 'absent', e)}
                                                        disabled={isUpdating || currentStatus === 'absent'}
                                                        className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Mark as Absent"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="4" className="p-6 text-center text-gray-500">
                                            This trip has no participants yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripAttendance;