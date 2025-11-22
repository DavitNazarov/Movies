// Controller functions for user management routes

import { User } from "../model/User.model.js";
import bcrypt from "bcryptjs";

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

// GET /api/users/stats - get user statistics
export const getUserStats = async (req, res) => {
  try {
    const [totalUsers, totalAdmins, unverifiedUsers] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isAdmin: true }),
      User.countDocuments({ isVerified: false }),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        unverifiedUsers,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
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

// PATCH /api/users/me/password - change password from profile
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body ?? {};

  // Validation
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters",
    });
  }

  try {
    // Get user with password field
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Check if new password is different
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
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
