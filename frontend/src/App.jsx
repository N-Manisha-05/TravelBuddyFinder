

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import react,{useContext} from "react";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

import Register from "./pages/Register";
import Login from "./pages/Login";
import AllTrips from "./pages/AllTrips";
import CreateTrip from "./pages/CreateTrip";

import TravelDiary from "./pages/TravelDiary";
import Favorites from "./pages/Favorites";
import SpinPage from "./pages/SpinPage";
import TripChatPage from "./pages/TripChatPage";

import GuideDashboard from "./pages/GuideDashboard";
import TripAttendance from "./pages/TripAttendance";

import AdminDashboard from "./pages/AdminDashboard";
import AdminNavbar from "./components/AdminNavbar";
import AdminUserList from "./pages/AdminUserList";
import AdminLayout from "./layouts/AdminLayout";
import AdminTrips from "./pages/AdminTrips";
import AdminVerification from "./pages/AdminVerification";
import Recommendations from "./pages/Recommendations"; 

function AppContent() {
  const location = useLocation();    // ✅ now inside Router
  const isAdminPage = location.pathname.startsWith("/admin");

  const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") return <Navigate to="/login" />;
    return children;
  };

  const GuideRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    return user && user.role === "guide" ? children : <Navigate to="/login" />;
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hide Main Navbar on Admin Routes */}
      {!isAdminPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/all-trips" element={<AllTrips />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/travel-diary" element={<TravelDiary />} />
        <Route path="/spins" element={<SpinPage />} />
        <Route path="/trip-chat/:tripId" element={<TripChatPage />} />
        <Route path="/favorites" element={<Favorites />} />

        <Route path="/guide/my-trips" element={<GuideRoute><GuideDashboard /></GuideRoute>} />
        <Route path="/guide/trip/:tripId/attendance" element={<GuideRoute><TripAttendance /></GuideRoute>} />
        <Route path="/recommendations" element={<Recommendations />} />


        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserList />} />
          <Route path="trips" element={<AdminTrips />} />
          <Route path="verification" element={<AdminVerification />} />
        </Route>
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent /> {/* Router context is active here */}
    </Router>
  );
}