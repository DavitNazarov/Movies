import jwt from "jsonwebtoken";
import { User } from "../model/User.model.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });

    // Fetch user from DB
  const user = await User.findById(decoded.userId).select(
      "_id name email imageUrl isAdmin isSuperAdmin isVerified adminRequestStatus adminRequestMessage adminRequestAt adminRequestResolvedAt favoriteMovies ratings"
    );
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    // Attach full user object
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
