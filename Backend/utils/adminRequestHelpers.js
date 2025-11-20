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
    .populate({ path: "requester", select: "name email" })
    .populate({ path: "target", select: "name email isAdmin isSuperAdmin" });

export const populateRequestDoc = (doc) =>
  doc.populate([
    { path: "requester", select: "name email" },
    { path: "target", select: "name email isAdmin isSuperAdmin" },
  ]);

export const formatRequestPayload = (doc) => {
  const obj = doc.toObject();
  const rawTargetId = doc.target?._id || doc.get?.("target") || doc.target;
  obj.targetId = rawTargetId ? rawTargetId.toString() : undefined;
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
