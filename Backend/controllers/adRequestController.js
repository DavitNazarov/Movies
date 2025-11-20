// Controller functions for ad request routes

import { AdRequest } from "../model/AdRequest.model.js";
import {
  populateAdRequest,
  checkOverlappingAds,
  getRecentAdRequests as fetchRecentAdRequests,
} from "../utils/adRequestHelpers.js";

// POST /api/ad-requests - create ad request
export const createAdRequest = async (req, res) => {
  const { imageUrl, linkUrl, startDate, endDate } = req.body ?? {};
  const uploadedFile = req.file;

  // Require either imageUrl OR uploaded file
  const hasImageUrl =
    imageUrl && typeof imageUrl === "string" && imageUrl.trim();
  const hasUploadedFile = uploadedFile && uploadedFile.filename;

  if (!hasImageUrl && !hasUploadedFile) {
    return res.status(400).json({
      success: false,
      message: "Either Image URL or Image File upload is required",
    });
  }

  if (!linkUrl || typeof linkUrl !== "string" || !linkUrl.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Link URL is required" });
  }

  // Determine final image URL
  let finalImageUrl;
  if (hasUploadedFile) {
    // For uploaded files, use relative path that matches the static file serving
    // Files are stored in Backend/uploads/ads/ and served from /uploads
    // Use relative URL so it works with both frontend proxy and direct backend access
    // The frontend will proxy /uploads requests to the backend, or use full URL in production
    const baseUrl =
      process.env.APP_URL || `http://localhost:${process.env.PORT || 5000}`;
    // Use full URL to ensure it works from frontend
    finalImageUrl = `${baseUrl}/uploads/ads/${uploadedFile.filename}`;
    console.log("Uploaded file path:", {
      filename: uploadedFile.filename,
      finalImageUrl: finalImageUrl,
      baseUrl: baseUrl,
      fileExists: require("fs").existsSync(
        require("path").join(__dirname, "../uploads/ads", uploadedFile.filename)
      )
    });
  } else {
    finalImageUrl = imageUrl.trim();
  }

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "Start date and end date are required",
    });
  }

  // Parse dates - should be in ISO format from frontend
  // ISO format includes timezone, so new Date() will parse it correctly
  let start, end;
  try {
    start = new Date(startDate);
    end = new Date(endDate);
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid date format" });
  }

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid date format" });
  }

  if (end <= start) {
    return res.status(400).json({
      success: false,
      message: "End date must be after start date",
    });
  }

  // Compare dates - be lenient to account for timezone differences
  // The ISO date from frontend represents the user's local time converted to UTC
  // We need to check if the date is today or in the future, not just if it's "in the past"
  // Allow a 24-hour buffer to account for timezone differences (max timezone offset is +/-12 hours)
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  // Only reject if the date is more than 24 hours in the past
  // This accounts for timezone differences and allows users to select times for today
  if (start < oneDayAgo) {
    return res.status(400).json({
      success: false,
      message: "Start date cannot be in the past",
    });
  }

  try {
    // Check for overlapping approved ads (deactivated ads are excluded)
    const overlappingAds = await checkOverlappingAds(start, end);

    if (overlappingAds.length > 0) {
      // Log for debugging - check if any overlapping ads are deactivated
      const overlappingStatuses = overlappingAds.map(ad => ({
        id: ad._id,
        status: ad.status,
        startDate: ad.startDate,
        endDate: ad.endDate
      }));
      console.log("Overlapping ads found:", overlappingStatuses);
      
      return res.status(400).json({
        success: false,
        message:
          "Please choose a different date range. Other ad is active at this time.",
      });
    }

    const adRequest = new AdRequest({
      requester: req.user._id,
      imageUrl: finalImageUrl,
      linkUrl: linkUrl.trim(),
      startDate: start,
      endDate: end,
      status: "pending",
    });

    await adRequest.save();
    await populateAdRequest(adRequest);

    res.json({
      success: true,
      adRequest: adRequest.toObject(),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create ad request" });
  }
};

// GET /api/ad-requests - get recent ad requests (max 5)
export const getRecentAdRequests = async (req, res) => {
  try {
    const requests = await fetchRecentAdRequests(5);

    res.json({
      success: true,
      requests: requests.map((r) => r.toObject()),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to load ad requests" });
  }
};

// GET /api/ad-requests/history - get ad requests from last 30 days
export const getAdRequestsHistory = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const requests = await AdRequest.find({
      createdAt: { $gte: thirtyDaysAgo },
    })
      .populate("requester", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests: requests.map((r) => r.toObject()),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to load history" });
  }
};

// GET /api/ad-requests/active - get currently active ads (public)
export const getActiveAds = async (req, res) => {
  try {
    const now = new Date();
    // Only get approved ads (exclude deactivated, declined, and pending)
    const activeAds = await AdRequest.find({
      status: "approved", // Explicitly only approved ads
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .populate("requester", "name email")
      .sort({ startDate: 1 });

    // Log for debugging
    console.log(`Found ${activeAds.length} active ads at ${now.toISOString()}`);
    if (activeAds.length > 0) {
      console.log("Active ads:", activeAds.map(ad => ({
        id: ad._id,
        imageUrl: ad.imageUrl,
        startDate: ad.startDate,
        endDate: ad.endDate,
        status: ad.status
      })));
    }

    res.json({
      success: true,
      ads: activeAds.map((ad) => ad.toObject()),
    });
  } catch (err) {
    console.error("Error in getActiveAds:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to load active ads" });
  }
};

// GET /api/ad-requests/unavailable-dates - get unavailable date ranges
export const getUnavailableDates = async (req, res) => {
  try {
    const now = new Date();
    const approvedAds = await AdRequest.find({
      status: "approved",
      endDate: { $gte: now },
    })
      .select("startDate endDate")
      .sort({ startDate: 1 });

    const unavailableRanges = approvedAds.map((ad) => ({
      start: ad.startDate.toISOString(),
      end: ad.endDate.toISOString(),
    }));

    res.json({
      success: true,
      unavailableRanges,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to load unavailable dates" });
  }
};

// GET /api/ad-requests/me - get current user's ad requests
export const getMyAdRequests = async (req, res) => {
  try {
    const requests = await AdRequest.find({ requester: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      requests: requests.map((r) => r.toObject()),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to load your ad requests" });
  }
};

// POST /api/ad-requests/:id/decision - super admin approves/declines
export const processAdRequestDecision = async (req, res) => {
  if (!req.user.isSuperAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Super admin only" });
  }

  const { id } = req.params;
  const { decision, responseMessage = "" } = req.body ?? {};

  if (!["approve", "decline"].includes(decision)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid decision" });
  }

  try {
    const adRequest = await AdRequest.findById(id);
    if (!adRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Ad request not found" });
    }

    if (adRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed",
      });
    }

    // If approving, check for overlapping approved ads
    if (decision === "approve") {
      const start = new Date(adRequest.startDate);
      const end = new Date(adRequest.endDate);

      const overlappingAds = await checkOverlappingAds(start, end, adRequest._id);

      if (overlappingAds.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot approve this ad request. Please choose a different date range. Other ad is active at this time.",
        });
      }
    }

    adRequest.status = decision === "approve" ? "approved" : "declined";
    adRequest.responseMessage =
      typeof responseMessage === "string" ? responseMessage.trim() : "";
    adRequest.resolvedAt = new Date();

    await adRequest.save();
    await populateAdRequest(adRequest);

    res.json({
      success: true,
      adRequest: adRequest.toObject(),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to process decision" });
  }
};

// POST /api/ad-requests/:id/deactivate - super admin deactivates an active ad
export const deactivateAd = async (req, res) => {
  if (!req.user.isSuperAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Super admin only" });
  }

  const { id } = req.params;
  const { message = "" } = req.body ?? {};

  try {
    const adRequest = await AdRequest.findById(id);
    if (!adRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Ad request not found" });
    }

    if (adRequest.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved ads can be deactivated",
      });
    }

    // Check if ad is currently active (within date range)
    const now = new Date();
    const isActive =
      adRequest.startDate <= now && adRequest.endDate >= now;

    if (!isActive) {
      return res.status(400).json({
        success: false,
        message: "This ad is not currently active",
      });
    }

    adRequest.status = "deactivated";
    adRequest.responseMessage =
      typeof message === "string" ? message.trim() : "";
    adRequest.resolvedAt = new Date();

    await adRequest.save();
    await populateAdRequest(adRequest);

    res.json({
      success: true,
      adRequest: adRequest.toObject(),
      message: "Ad has been deactivated successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to deactivate ad" });
  }
};

