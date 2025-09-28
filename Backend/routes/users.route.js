import express from "express";
import { User } from "../model/User.model.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// GET /api/users - admin only
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude password
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
