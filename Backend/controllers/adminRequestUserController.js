// Controller functions for admin request user routes

import { User } from "../model/User.model.js";

// POST /api/users/me/admin-request - request admin role
export const requestAdminRole = async (req, res) => {
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
};

// POST /api/users/:id/admin-request - admin approves or rejects admin request
export const processAdminRequest = async (req, res) => {
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
};

// PATCH /api/users/:id/status - direct status update (super admin only)
export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { isAdmin: adminStatus } = req.body ?? {};

  if (!req.user.isSuperAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Super admin only" });
  }

  if (Object.keys(req.body ?? {}).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No valid status fields provided" });
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
        message: "Cannot change status of the super admin",
      });
    }

    const update = {};
    if (typeof adminStatus === "boolean") {
      update.isAdmin = adminStatus;
      if (adminStatus) {
        if (user.adminRequestStatus === "pending") {
          update.adminRequestStatus = "approved";
          update.adminRequestResolvedAt = new Date();
        } else {
          update.adminRequestStatus = "approved";
          update.adminRequestResolvedAt = null;
        }
      } else {
        update.adminRequestStatus = "none";
        update.adminRequestMessage = "";
        update.adminRequestResolvedAt = new Date();
      }
    }

    if (Object.keys(update).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No valid status fields provided" });
    }

    Object.assign(user, update);
    await user.save();

    const safeUser = await User.findById(user._id).select(
      "_id name email imageUrl isAdmin isSuperAdmin isVerified adminRequestStatus adminRequestMessage adminRequestAt adminRequestResolvedAt favoriteMovies ratings"
    );

    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update user status" });
  }
};

