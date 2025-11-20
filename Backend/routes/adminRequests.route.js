import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createAdminRequest,
  getRecentAdminRequests,
  getAdminRequestsHistory,
  processAdminRequestDecision,
} from "../controllers/adminRequestController.js";

const router = express.Router();

router.post("/", verifyToken, createAdminRequest);
router.get("/", verifyToken, getRecentAdminRequests);
router.get("/history", verifyToken, getAdminRequestsHistory);
router.post("/:id/decision", verifyToken, processAdminRequestDecision);

export default router;
