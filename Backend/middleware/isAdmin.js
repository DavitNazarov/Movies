export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
