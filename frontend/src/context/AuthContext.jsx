

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch logged-in user on first load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          withCredentials: true,
        });
        setUser(res.data.user); // set user in context
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Login function to update context after successful login
  const login = (userData) => {
    setUser(userData);
  };

  // Logout function to clear user
  const logout = async () => {
    await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
