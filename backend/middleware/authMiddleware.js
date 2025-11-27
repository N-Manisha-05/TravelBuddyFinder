

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token; // read token from cookie
    if(!token){
      token = req.headers.authorization?.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // fetch user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    // attach to request
    req.user = user;

    // ✅ log AFTER attaching
    console.log("🔑 Authenticated user:", req.user._id);

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const isGuide = (req, res, next) => {
  if (req.user && req.user.role === 'guide') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Not a guide." });
  }
};