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
      "_id name email imageUrl isAdmin isSuperAdmin isVerified adminRequestStatus adminRequestMessage adminRequestAt adminRequestResolvedAt"
    );

    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
});

// POST /api/users/me/admin-request - request admin role
router.post("/me/admin-request", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "You already have admin access" });
    }

    if (user.adminRequestStatus === "pending") {
      return res.status(400).json({
        success: false,
        message: "Your previous request is still pending",
      });
    }

    user.adminRequestStatus = "pending";
    user.adminRequestAt = new Date();
    user.adminRequestMessage = "";
    user.adminRequestResolvedAt = undefined;

    await user.save();

    const safeUser = await User.findById(user._id).select(
      "_id name email imageUrl isAdmin isSuperAdmin isVerified adminRequestStatus adminRequestMessage adminRequestAt adminRequestResolvedAt"
    );

    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to submit request" });
  }
});

// DELETE /api/users/:id - admin can delete users
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  if (!req.user.isSuperAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Super admin only" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isSuperAdmin) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the super admin",
      });
    }

    await user.deleteOne();
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

// POST /api/users/:id/admin-request - admin approves or rejects admin request
router.post("/:id/admin-request", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { action, message = "" } = req.body ?? {};

  if (!req.user.isSuperAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Super admin only" });
  }

  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ success: false, message: "Invalid action" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isSuperAdmin) {
      return res.status(400).json({
        success: false,
        message: "Cannot change status of super admin",
      });
    }

    if (action === "approve") {
      user.isAdmin = true;
      user.adminRequestStatus = "approved";
    } else {
      user.adminRequestStatus = "declined";
    }

    user.adminRequestMessage = message;
    user.adminRequestResolvedAt = new Date();

    await user.save();

    const safeUser = await User.findById(user._id).select(
      "_id name email imageUrl isAdmin isSuperAdmin isVerified adminRequestStatus adminRequestMessage adminRequestAt adminRequestResolvedAt"
    );

    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to process request" });
  }
});

export default router;
