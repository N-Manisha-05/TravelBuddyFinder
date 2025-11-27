import React, { useEffect, useState, useContext } from "react";
import TripCard from "../components/TripCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import { getFavorites, removeFavorite, addFavorite } from "../services/tripService";

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const [favoritesTrips, setFavoritesTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoritesIds, setFavoritesIds] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await getFavorites();
        setFavoritesTrips(data);
        setFavoritesIds(data.map((t) => t._id));
      } catch (err) {
        toast.error("Failed to fetch favorites");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  const handleAddFavorite = async (tripId) => {
    try {
      await addFavorite(tripId);
      setFavoritesIds((prev) => [...prev, tripId]);
      toast.success("Added to favorites");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add favorite");
    }
  };

  const handleRemoveFavorite = async (tripId) => {
    try {
      await removeFavorite(tripId);
      setFavoritesIds((prev) => prev.filter((id) => id !== tripId));
      setFavoritesTrips((prev) => prev.filter((t) => t._id !== tripId));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove favorite");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-6">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">My Favorites</h1>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-20 text-gray-500">
              Loading favorites…
            </div>
          ) : favoritesTrips.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-500">
              No trips saved in favorites.
            </div>
          ) : (
            favoritesTrips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onJoin={() => {}}
                onLeave={() => {}}
                onRequest={() => {}}
                onViewParticipants={() => {}}
                onManageRequests={() => {}}
                favorites={favoritesIds}
                currentUserId={user?._id || user?.id}
                onToggleFavorite={(tripId) =>
                  favoritesIds.includes(tripId)
                    ? handleRemoveFavorite(tripId)
                    : handleAddFavorite(tripId)
                }
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default Favorites;
