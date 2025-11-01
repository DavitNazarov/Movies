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

// PATCH /api/users/me - update current user's profile
router.patch("/me", verifyToken, async (req, res) => {
  const { name } = req.body ?? {};
  const trimmedName = typeof name === "string" ? name.trim() : "";

  if (!trimmedName) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name: trimmedName },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const safeUser = await User.findById(updatedUser._id).select(
      "_id name email imageUrl isAdmin isVerified"
    );

    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
});

// DELETE /api/users/:id - admin can delete users
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.deleteOne();
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

export default router;
