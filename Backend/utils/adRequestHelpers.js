// Helper functions for ad request routes

import { AdRequest } from "../model/AdRequest.model.js";

// Helper to populate requester info
export const populateAdRequest = async (request) => {
  await request.populate({
    path: "requester",
    select: "name email",
  });
};

// Check for overlapping approved ads (excludes deactivated and declined)
export const checkOverlappingAds = async (startDate, endDate, excludeId = null) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const query = {
    status: "approved", // Only check approved ads, exclude deactivated and declined
    $or: [
      // New start date falls within existing ad's date range
      {
        startDate: { $lte: start },
        endDate: { $gte: start },
      },
      // New end date falls within existing ad's date range
      {
        startDate: { $lte: end },
        endDate: { $gte: end },
      },
      // New date range completely encompasses existing ad
      {
        startDate: { $gte: start },
        endDate: { $lte: end },
      },
    ],
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return await AdRequest.find(query).populate("requester", "name email");
};

// Get recent ad requests (prioritize pending)
export const getRecentAdRequests = async (limit = 5) => {
  const pendingRequests = await AdRequest.find({ status: "pending" })
    .sort({ createdAt: -1 })
    .limit(limit);

  const pendingCount = pendingRequests.length;
  const remaining = limit - pendingCount;

  let otherRequests = [];
  if (remaining > 0) {
    otherRequests = await AdRequest.find({ status: { $ne: "pending" } })
      .sort({ createdAt: -1 })
      .limit(remaining);
  }

  const allRequestIds = [...pendingRequests, ...otherRequests].map((r) => r._id);
  return await AdRequest.find({ _id: { $in: allRequestIds } })
    .populate("requester", "name email")
    .sort({ createdAt: -1 });
};

