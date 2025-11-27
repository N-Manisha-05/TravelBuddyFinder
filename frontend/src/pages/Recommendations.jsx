import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Star, MapPin, Compass, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Recommendations = () => {
  const [recommendedTrips, setRecommendedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/recommend`, {
        withCredentials: true,
      });
      setRecommendedTrips(res.data.recommended || []);
    } catch (err) {
      console.error(err);
      setRecommendedTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Title Section */}
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-indigo-700 flex justify-center items-center gap-2"
          >
            <Sparkles className="text-yellow-500" /> Trip Recommendations
          </motion.h2>
          <p className="text-gray-600 mt-2">
            Smart suggestions based on your interests, budget, and travel style
          </p>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center text-indigo-600 text-xl font-semibold mt-20">
            Loading recommendations...
          </div>
        )}

        {/* No Recommendations */}
        {!loading && recommendedTrips.length === 0 && (
          <div className="text-center text-gray-600 text-lg mt-10">
            No recommendations found.
          </div>
        )}

        {/* Recommendation Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {recommendedTrips.map((item, index) => (
          <motion.div
            key={item.trip._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
           onClick={() => navigate(`/all-trips?trip=${item.trip._id}`)}

            className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition cursor-pointer border border-gray-100"
          >
             {/* <div className="flex items-center gap-2 text-sm text-indigo-600 font-semibold mb-2">
              <Compass className="w-4 h-4" />
              ML Score: {(item.score * 10).toFixed(1)} 
            </div>  */}

            <h3 className="text-2xl font-bold text-gray-800">
              {item.trip.destination}
            </h3>

            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <MapPin className="w-4 h-4" />
              {item.trip.startPoint || "Unknown Start"}
            </div>

            <div className="mt-4">
              <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                Budget: ₹{item.trip.budget}
              </span>
            </div>

            <div className="mt-2">
              <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                Days: {item.trip.days}
              </span>
            </div>

            {item.trip.travelType?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.trip.travelType.map((type) => (
                  <span
                    key={type}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                  >
                    {type}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
