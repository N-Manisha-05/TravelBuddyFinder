export const adminOnly = (req, res, next) => {
  console.log(req.user)
  if (!req.user || req.user.role !== "admin") {
    console.log("errorrr")
    return res.status(403).json({ message: "Access denied: Admin only" });
  }
  next();
};
