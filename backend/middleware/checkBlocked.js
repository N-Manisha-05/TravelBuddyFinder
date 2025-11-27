// middleware/checkBlocked.js

  export const checkBlocked = (req, res, next) => {
    if (req.user.status === "blocked") {
      return res.status(403).json({ message: "Your account is blocked" });
    }
    next();
  };
  