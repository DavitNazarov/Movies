// Ad Request Routes
// Handles ad banner requests from users
// Super admin can approve/decline
// Other admins can view but not act
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { upload } from "../middleware/upload.js";
import {
  createAdRequest,
  getRecentAdRequests,
  getAdRequestsHistory,
  getActiveAds,
  getUnavailableDates,
  getMyAdRequests,
  processAdRequestDecision,
  deactivateAd,
} from "../controllers/adRequestController.js";

const router = express.Router();

// POST /api/ad-requests - create ad request (logged in users)
router.post("/", verifyToken, upload.single("imageFile"), createAdRequest);

router.get("/", verifyToken, isAdmin, getRecentAdRequests);
router.get("/history", verifyToken, isAdmin, getAdRequestsHistory);
router.get("/active", getActiveAds);
router.get("/unavailable-dates", getUnavailableDates);
router.get("/me", verifyToken, getMyAdRequests);
router.post("/:id/decision", verifyToken, isAdmin, processAdRequestDecision);
router.post("/:id/deactivate", verifyToken, isAdmin, deactivateAd);

export default router;
