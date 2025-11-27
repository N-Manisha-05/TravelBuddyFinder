// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";
// import { LogOut, UserCircle, Briefcase } from "lucide-react";

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate("/login");
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//   };

//   return (
//     <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      
//       {/* Logo */}
//       <h1
//         className="font-extrabold text-2xl cursor-pointer hover:text-indigo-300 transition"
//         onClick={() => navigate("/")}
//       >
//         Travel Buddy Finder
//       </h1>

//       {/* Menu */}
//       <div className="flex items-center gap-x-8 text-sm font-medium">

//         <Link to="/" className="hover:text-indigo-300 transition">Home</Link>
//         <Link to="/travel-diary" className="hover:text-indigo-300 transition">Travel Diary</Link>

//         {user && user.role !== "guide" && (
//           <>
//             <Link to="/all-trips" className="hover:text-indigo-300 transition">All Trips</Link>
//             <Link to="/create-trip" className="hover:text-indigo-300 transition">Create Trip</Link>
//             <Link to="/spins" className="hover:text-indigo-300 transition">Spin</Link>

//             {/* ML Recommendations merged visually */}
//             <Link to="/recommendations" className="hover:text-indigo-300 transition">
//               Recommendations
//             </Link>
//           </>
//         )}

//         {/* Guide-specific menu */}
//         {user?.role === "guide" && (
//           <Link
//             to="/guide/my-trips"
//             className="flex items-center gap-1.5 hover:text-yellow-300 transition text-yellow-400 font-semibold"
//           >
//             <Briefcase size={16} />
//             My Assigned Trips
//           </Link>
//         )}

//         {/* Right side buttons */}
//         {user ? (
//           <div className="flex items-center gap-x-5">

//             <Link to="/profile" className="flex items-center gap-2 hover:text-indigo-300 transition">
//               <UserCircle size={20} />
//               Profile
//             </Link>

//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-md hover:bg-red-700 transition font-medium"
//             >
//               <LogOut size={16} />
//               Logout
//             </button>
//           </div>
//         ) : (
//           <>
//             <Link to="/login" className="hover:text-indigo-300 transition">Sign In</Link>
//             <Link
//               to="/register"
//               className="bg-indigo-600 px-4 py-1.5 rounded-lg font-medium hover:bg-indigo-700 transition"
//             >
//               Sign Up
//             </Link>
//           </>
//         )}

//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, UserCircle, Briefcase, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <h1
          className="font-extrabold text-2xl cursor-pointer hover:text-indigo-300 transition"
          onClick={() => navigate("/")}
        >
          Travel Buddy Finder
        </h1>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-x-8 text-sm font-medium">

          <Link to="/" className="hover:text-indigo-300 transition">Home</Link>
          <Link to="/travel-diary" className="hover:text-indigo-300 transition">Travel Diary</Link>

          {user && user.role !== "guide" && (
            <>
              <Link to="/all-trips" className="hover:text-indigo-300 transition">All Trips</Link>
              <Link to="/create-trip" className="hover:text-indigo-300 transition">Create Trip</Link>
              <Link to="/spins" className="hover:text-indigo-300 transition">Spin</Link>
              <Link to="/recommendations" className="hover:text-indigo-300 transition">Recommendations</Link>
            </>
          )}

          {user?.role === "guide" && (
            <Link
              to="/guide/my-trips"
              className="flex items-center gap-1.5 hover:text-yellow-300 transition text-yellow-400 font-semibold"
            >
              <Briefcase size={16} />
              My Assigned Trips
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-x-5">
              <Link to="/profile" className="flex items-center gap-2 hover:text-indigo-300 transition">
                <UserCircle size={20} /> Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-md hover:bg-red-700 transition font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-300 transition">Sign In</Link>
              <Link
                to="/register"
                className="bg-indigo-600 px-4 py-1.5 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-6 text-sm font-medium bg-gray-800">

          <Link to="/" className="hover:text-indigo-300 transition" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/travel-diary" className="hover:text-indigo-300 transition" onClick={() => setOpen(false)}>Travel Diary</Link>

          {user && user.role !== "guide" && (
            <>
              <Link to="/all-trips" className="hover:text-indigo-300 transition" onClick={() => setOpen(false)}>All Trips</Link>
              <Link to="/create-trip" className="hover:text-indigo-300 transition" onClick={() => setOpen(false)}>Create Trip</Link>
              <Link to="/spins" className="hover:text-indigo-300 transition" onClick={() => setOpen(false)}>Spin</Link>
              <Link to="/recommendations" className="hover:text-indigo-300 transition" onClick={() => setOpen(false)}>Recommendations</Link>
            </>
          )}

          {user?.role === "guide" && (
            <Link
              to="/guide/my-trips"
              className="flex items-center gap-1.5 hover:text-yellow-300 transition text-yellow-400 font-semibold"
              onClick={() => setOpen(false)}
            >
              <Briefcase size={16} />
              My Assigned Trips
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:text-indigo-300 transition"
                onClick={() => setOpen(false)}
              >
                <UserCircle size={20} />
                Profile
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="flex items-center gap-2 bg-red-600 px-3 py-1.5 w-fit rounded-md hover:bg-red-700 transition font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-300 transition" onClick={() => setOpen(false)}>Sign In</Link>
              <Link
                to="/register"
                className="bg-indigo-600 px-4 py-1.5 rounded-lg font-medium hover:bg-indigo-700 transition w-fit"
                onClick={() => setOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}

        </div>
      )}
    </nav>
  );
};

export default Navbar;
