import React from "react";
import { useParams } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const TripChatPage = () => {
  const { tripId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Group Chat 💬
      </h1>
      <button
          onClick={() => navigate("../all-trips")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ← Back to Trip Page
        </button>
      <ChatWindow tripId={tripId} currentUser={user} />
    </div>
  );
};

export default TripChatPage;
