// Helper functions for admin request routes

import { AdminActionRequest } from "../model/AdminActionRequest.model.js";

export const ACTIONS = ["delete_user", "promote_admin", "demote_admin"];

export const ACTION_SUBJECTS = {
  delete_user: "Delete user request",
  promote_admin: "Promote admin request",
  demote_admin: "Remove admin privileges request",
};

export const populateRequestQuery = (query) =>
  query
    .populate({
      path: "requester",
      select: "name email",
      strictPopulate: false,
    })
    .populate({
      path: "target",
      select: "name email isAdmin isSuperAdmin",
      strictPopulate: false,
    });

export const populateRequestDoc = (doc) =>
  doc.populate([
    { path: "requester", select: "name email", strictPopulate: false },
    {
      path: "target",
      select: "name email isAdmin isSuperAdmin",
      strictPopulate: false,
    },
  ]);

export const formatRequestPayload = (doc) => {
  // Get raw requester ID before toObject() (in case user was deleted)
  const rawRequesterId =
    doc.get?.("requester") || doc.requester?._id || doc.requester;
  const rawTargetId = doc.target?._id || doc.get?.("target") || doc.target;

  const obj = doc.toObject();
  obj.targetId = rawTargetId ? rawTargetId.toString() : undefined;

  // Handle null requester (if user was deleted or not found)
  // When a user is deleted, populate() returns null even though the ObjectId exists
  if (!obj.requester) {
    if (rawRequesterId) {
      // Requester ID exists but populate returned null = user was deleted
      obj.requester = {
        _id: rawRequesterId.toString(),
        name: "Deleted User",
        email: "N/A",
      };
    } else {
      // No requester ID at all (shouldn't happen, but handle gracefully)
      obj.requester = {
        _id: null,
        name: "Unknown",
        email: "N/A",
      };
    }
  }

  return obj;
};

export const getRecentRequests = async (filter, limit = 5) => {
  const pendingRequests = await AdminActionRequest.find({
    ...filter,
    status: "pending",
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  const pendingCount = pendingRequests.length;
  const remaining = limit - pendingCount;

  let otherRequests = [];
  if (remaining > 0) {
    otherRequests = await AdminActionRequest.find({
      ...filter,
      status: { $ne: "pending" },
    })
      .sort({ createdAt: -1 })
      .limit(remaining);
  }

  return [...pendingRequests, ...otherRequests];
};
