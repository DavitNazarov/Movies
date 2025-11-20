// Controller functions for user management routes

import { User } from "../model/User.model.js";

// GET /api/users - get recent users (max 10)
export const getRecentUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password")
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/all - get all users with optional search
export const getAllUsers = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const searchTerm = typeof search === "string" ? search.trim() : "";

    let query = {};
    if (searchTerm) {
      query = {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
          { adminRequestStatus: { $regex: searchTerm, $options: "i" } },
          {
            isAdmin:
              searchTerm.toLowerCase() === "yes" ||
              searchTerm.toLowerCase() === "admin",
          },
          {
            isVerified:
              searchTerm.toLowerCase() === "yes" ||
              searchTerm.toLowerCase() === "verified",
          },
        ],
      };
    }

    const users = await User.find(query, "-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/users/me - update current user's profile
export const updateProfile = async (req, res) => {
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
};

// DELETE /api/users/:id - delete user (super admin only)
export const deleteUser = async (req, res) => {
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
};
