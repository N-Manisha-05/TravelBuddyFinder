// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { MapPin, Calendar, Users, ClipboardList } from 'lucide-react';

// const GuideDashboard = () => {
//     const [myTrips, setMyTrips] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [completedTrips, setCompletedTrips] = useState([]);
   

//     // Helper to get authorization headers
//     const getAuthHeaders = () => {
//         const token = localStorage.getItem("token");
//         return { headers: { Authorization: `Bearer ${token}` } };
//     };

//     useEffect(() => {
//     const fetchMyTrips = async () => {
//         try {
//         const res = await axios.get("http://localhost:5000/api/guides/my-trips", getAuthHeaders());
//         setMyTrips(res.data.trips || []);
//         } catch (error) {
//         toast.error("Failed to fetch assigned trips.");
//         console.error("Fetch trips error:", error);
//         } finally {
//         setLoading(false);
//         }
//     };

//     const fetchCompleted = async () => {
//         try {
//         const res = await axios.get("http://localhost:5000/api/guides/completed", getAuthHeaders());
//         setCompletedTrips(res.data.trips || []);
//         } catch (err) {
//         console.error("Failed to fetch completed trips", err);
//         }
//     };

//     fetchMyTrips();
//     fetchCompleted();
//     }, []);


//     if (loading) {
//         return <div className="text-center p-10">Loading your assigned trips...</div>;
//     }

//     return (
//         <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
//             <ToastContainer />
//             <div className="max-w-7xl mx-auto">
//                 <h1 className="text-3xl font-bold text-gray-800 mb-6">My Assigned Trips</h1>
                
//                 {myTrips.length === 0 ? (
//                     <div className="text-center bg-white p-10 rounded-lg shadow">
//                         <h2 className="text-xl font-semibold text-gray-700">No trips assigned yet.</h2>
//                         <p className="text-gray-500 mt-2">Check back later for new assignments.</p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {myTrips.map(trip => (
//                              const hasStarted = new Date(trip.startTime) <= new Date();
//                             <div key={trip._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
//                                 <div className="p-5">
//                                     <h2 className="text-2xl font-bold text-blue-600 mb-2">{trip.destination}</h2>
//                                     <div className="space-y-2 text-gray-600">
//                                         <p className="flex items-center gap-2"><MapPin size={16} /> <strong>From:</strong> {trip.startPoint}</p>
//                                         <p className="flex items-center gap-2"><Calendar size={16} /> <strong>Starts:</strong> {new Date(trip.startTime).toLocaleDateString()}</p>
//                                         <p className="flex items-center gap-2"><Users size={16} /> <strong>Creator:</strong> {trip.creator.name}</p>
//                                     </div>
//                                 </div>
//                                 <div className="bg-gray-50 p-4">
//                                     {hasStarted ? (
//                                     <Link
//                                         to={`/guide/trip/${trip._id}/attendance`}
//                                         className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
//                                     >
//                                         <ClipboardList size={18} />
//                                         Take Attendance
//                                     </Link>
//                                 ) : (
//                                     <button
//                                         disabled
//                                         className="w-full flex items-center justify-center gap-2 bg-gray-300 text-gray-600 font-semibold py-2 rounded-lg cursor-not-allowed"
//                                     >
//                                         <ClipboardList size={18} />
//                                         Starts Soon
//                                     </button>
//                                 )}

//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//             {/* Completed Trips */}
//             <div className="mt-8">
//             <h2 className="text-2xl font-bold mb-4">Completed Trips</h2>
//             {completedTrips.length === 0 ? (
//                 <p className="text-gray-500">No completed trips yet.</p>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {completedTrips.map(trip => (
//                     <div key={trip._id} className="bg-white p-4 rounded shadow">
//                     <h3 className="text-lg font-semibold text-green-600">{trip.destination}</h3>
//                     <p className="text-sm text-gray-600">Completed on: {new Date(trip.startTime).toLocaleDateString()}</p>
//                     <Link to={`/guide/trip/${trip._id}/attendance`} className="mt-3 inline-block text-sm text-blue-600 hover:underline">View Attendance</Link>
//                     </div>
//                 ))}
//                 </div>
//             )}
//             </div>

//         </div>
//     );
// };

// export default GuideDashboard;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MapPin, Calendar, Users, ClipboardList } from 'lucide-react';

const GuideDashboard = () => {
    const [myTrips, setMyTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [completedTrips, setCompletedTrips] = useState([]);

    // Helper to get authorization headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    useEffect(() => {
        const fetchMyTrips = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/guides/my-trips", getAuthHeaders());
                setMyTrips(res.data.trips || []);
            } catch (error) {
                toast.error("Failed to fetch assigned trips.");
                console.error("Fetch trips error:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCompleted = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/guides/completed", getAuthHeaders());
                setCompletedTrips(res.data.trips || []);
            } catch (err) {
                console.error("Failed to fetch completed trips", err);
            }
        };

        fetchMyTrips();
        fetchCompleted();
    }, []);

    if (loading) {
        return <div className="text-center p-10">Loading your assigned trips...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <ToastContainer />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Assigned Trips</h1>

                {myTrips.length === 0 ? (
                    <div className="text-center bg-white p-10 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-700">No trips assigned yet.</h2>
                        <p className="text-gray-500 mt-2">Check back later for new assignments.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myTrips.map(trip => {
                            const hasStarted = new Date(trip.startTime) <= new Date();

                            return (
                                <div key={trip._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                                    <div className="p-5">
                                        <h2 className="text-2xl font-bold text-blue-600 mb-2">{trip.destination}</h2>
                                        <div className="space-y-2 text-gray-600">
                                            <p className="flex items-center gap-2">
                                                <MapPin size={16} /> 
                                                <strong>From:</strong> {trip.startPoint}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Calendar size={16} /> 
                                                <strong>Starts:</strong> {new Date(trip.startTime).toLocaleDateString()}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Users size={16} /> 
                                                <strong>Creator:</strong> {trip.creator.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4">
                                        {hasStarted ? (
                                            <Link
                                                to={`/guide/trip/${trip._id}/attendance`}
                                                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
                                            >
                                                <ClipboardList size={18} />
                                                Take Attendance
                                            </Link>
                                        ) : (
                                            <button
                                                disabled
                                                className="w-full flex items-center justify-center gap-2 bg-gray-300 text-gray-600 font-semibold py-2 rounded-lg cursor-not-allowed"
                                            >
                                                <ClipboardList size={18} />
                                                Starts Soon
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Completed Trips */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Completed Trips</h2>
                {completedTrips.length === 0 ? (
                    <p className="text-gray-500">No completed trips yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {completedTrips.map(trip => (
                            <div key={trip._id} className="bg-white p-4 rounded shadow">
                                <h3 className="text-lg font-semibold text-green-600">{trip.destination}</h3>
                                <p className="text-sm text-gray-600">Completed on: {new Date(trip.startTime).toLocaleDateString()}</p>
                                <Link 
                                    to={`/guide/trip/${trip._id}/attendance`} 
                                    className="mt-3 inline-block text-sm text-blue-600 hover:underline"
                                >
                                    View Attendance
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuideDashboard;
