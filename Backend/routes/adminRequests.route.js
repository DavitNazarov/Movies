import express from "express";
import mongoose from "mongoose";

import { verifyToken } from "../middleware/verifyToken.js";
import { AdminActionRequest } from "../model/AdminActionRequest.model.js";
import { User } from "../model/User.model.js";
import { sendEmail } from "../mail/sendEmail.js";
import { adminRequestCreatedTemplate } from "../mail/templates/adminRequestCreated.js";
import { adminRequestDecisionTemplate } from "../mail/templates/adminRequestDecision.js";

const router = express.Router();

const ACTIONS = ["delete_user", "promote_admin", "demote_admin"];

const ACTION_SUBJECTS = {
  delete_user: "Delete user request",
  promote_admin: "Promote admin request",
  demote_admin: "Remove admin privileges request",
};

const appBaseUrl = (process.env.APP_URL || "https://moviedb-ch39.onrender.com")
  .trim()
  .replace(/\/$/, "");
const dashboardUrl = process.env.APP_DASHBOARD_URL || `${appBaseUrl}/dashboard`;

const populateRequestQuery = (query) =>
  query
    .populate({ path: "requester", select: "name email" })
    .populate({ path: "target", select: "name email isAdmin isSuperAdmin" });

const populateRequestDoc = (doc) =>
  doc.populate([
    { path: "requester", select: "name email" },
    { path: "target", select: "name email isAdmin isSuperAdmin" },
  ]);

router.post("/", verifyToken, async (req, res) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ success: false, message: "Admins only" });
  }

  if (req.user.isSuperAdmin) {
    return res.status(400).json({
      success: false,
      message: "Super admin can perform actions directly",
    });
  }

  const { targetId, action, message = "" } = req.body ?? {};

  if (!targetId || !mongoose.Types.ObjectId.isValid(targetId)) {
    return res
      .status(400)
      .json({ success: false, message: "Valid targetId is required" });
  }

  if (!ACTIONS.includes(action)) {
    return res.status(400).json({ success: false, message: "Invalid action" });
  }

  try {
    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "Target user not found" });
    }

    if (targetUser.isSuperAdmin) {
      return res.status(400).json({
        success: false,
        message: "You cannot target the super admin",
      });
    }

    if (action === "promote_admin" && targetUser.isAdmin) {
      return res.status(400).json({
        success: false,
        message: "User is already an admin",
      });
    }

    if (action === "demote_admin" && !targetUser.isAdmin) {
      return res.status(400).json({
        success: false,
        message: "User is not an admin",
      });
    }

    if (action === "demote_admin" && targetUser.isSuperAdmin) {
      return res.status(400).json({
        success: false,
        message: "Cannot demote the super admin",
      });
    }

    const existing = await AdminActionRequest.findOne({
      requester: req.user._id,
      target: targetId,
      action,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A pending request already exists",
      });
    }

    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    const request = await AdminActionRequest.create({
      requester: req.user._id,
      target: targetId,
      targetName: targetUser.name,
      targetEmail: targetUser.email,
      action,
      message: trimmedMessage,
    });

    await populateRequestDoc(request);
    const data = request.toObject();
    const rawTargetId =
      request.target?._id || request.get?.("target") || request.target;
    data.targetId = rawTargetId ? rawTargetId.toString() : undefined;

    const superAdmins = await User.find({
      isSuperAdmin: true,
      email: { $exists: true, $ne: "" },
    }).select("name email");

    const fallbackEmail = process.env.SUPERADMIN_FALLBACK_EMAIL;
    const recipients = [
      ...superAdmins.map((admin) => ({ email: admin.email, name: admin.name })),
      ...(fallbackEmail ? [{ email: fallbackEmail }] : []),
    ];

    if (recipients.length) {
      const subject = `[Admin request] ${
        ACTION_SUBJECTS[action] || "Action required"
      }`;
      const plainText = `${req.user.name || "An admin"} requested to ${
        ACTION_SUBJECTS[action] || action
      } for ${targetUser.name || targetUser.email}. Review: ${dashboardUrl}`;

      try {
        await sendEmail({
          to: recipients,
          subject,
          html: adminRequestCreatedTemplate({
            requesterName: req.user.name,
            requesterEmail: req.user.email,
            action,
            targetName: targetUser.name,
            targetEmail: targetUser.email,
            dashboardUrl,
            message: trimmedMessage,
          }),
          text: plainText,
          category: "admin-action",
        });
      } catch (emailErr) {
        console.error("Failed to send admin request email", emailErr);
      }
    }

    res.json({ success: true, request: data });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to submit request" });
  }
});

router.get("/", verifyToken, async (req, res) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ success: false, message: "Admins only" });
  }

  const filter = req.user.isSuperAdmin ? {} : { requester: req.user._id };

  try {
    const requestQuery = populateRequestQuery(
      AdminActionRequest.find(filter).sort({ createdAt: -1 })
    );
    const docs = await requestQuery.exec();
    const payload = docs.map((doc) => {
      const obj = doc.toObject();
      const rawTargetId = doc.target?._id || doc.get?.("target") || doc.target;
      obj.targetId = rawTargetId ? rawTargetId.toString() : undefined;
      return obj;
    });

    res.json({ success: true, requests: payload });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to load requests" });
  }
});

router.post("/:id/decision", verifyToken, async (req, res) => {
  if (!req.user?.isSuperAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Super admin only" });
  }

  const { id } = req.params;
  const { decision, message = "" } = req.body ?? {};

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid request id" });
  }

  if (!["approve", "decline"].includes(decision)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid decision" });
  }

  try {
    const request = await AdminActionRequest.findById(id);

    if (!request || request.status !== "pending") {
      return res.status(404).json({
        success: false,
        message: "Request not found or already processed",
      });
    }

    const trimmedMessage = typeof message === "string" ? message.trim() : "";
    let targetUser = await User.findById(request.target);

    if (decision === "approve") {
      switch (request.action) {
        case "delete_user":
          if (!targetUser) {
            request.status = "approved";
            break;
          }
          if (targetUser.isSuperAdmin) {
            return res.status(400).json({
              success: false,
              message: "Cannot delete the super admin",
            });
          }
          request.targetName = targetUser.name;
          request.targetEmail = targetUser.email;
          await targetUser.deleteOne();
          targetUser = null;
          request.status = "approved";
          break;
        case "promote_admin":
          if (!targetUser) {
            return res
              .status(404)
              .json({ success: false, message: "Target user not found" });
          }
          targetUser.isAdmin = true;
          await targetUser.save();
          request.status = "approved";
          break;
        case "demote_admin":
          if (!targetUser) {
            return res
              .status(404)
              .json({ success: false, message: "Target user not found" });
          }
          if (targetUser.isSuperAdmin) {
            return res.status(400).json({
              success: false,
              message: "Cannot demote the super admin",
            });
          }
          targetUser.isAdmin = false;
          await targetUser.save();
          request.status = "approved";
          break;
        default:
          break;
      }
    } else {
      request.status = "declined";
    }

    request.responseMessage = trimmedMessage;
    request.resolvedAt = new Date();
    await request.save();

    await populateRequestDoc(request);
    const data = request.toObject();
    const rawTargetId =
      request.target?._id || request.get?.("target") || request.target;
    data.targetId = rawTargetId ? rawTargetId.toString() : undefined;

    const payload = {
      success: true,
      request: data,
      target: targetUser && {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        isAdmin: targetUser.isAdmin,
        isSuperAdmin: targetUser.isSuperAdmin,
      },
    };

    const requesterEmail = request.requester?.email;
    if (requesterEmail) {
      const subject = `[Admin request] ${
        ACTION_SUBJECTS[request.action] || "Update"
      } ${request.status === "approved" ? "approved" : "declined"}`;
      const plainText = `Your request to ${
        ACTION_SUBJECTS[request.action] || request.action
      } for ${targetUser?.name || request.targetName || "the user"} was ${
        request.status
      }.
Review: ${dashboardUrl}`;

      try {
        await sendEmail({
          to: { email: requesterEmail, name: request.requester?.name },
          subject,
          html: adminRequestDecisionTemplate({
            requesterName: request.requester?.name,
            action: request.action,
            status: request.status,
            targetName: targetUser?.name || request.targetName,
            targetEmail: targetUser?.email || request.targetEmail,
            dashboardUrl,
            responseMessage: trimmedMessage,
          }),
          text: plainText,
          category: "admin-action",
        });
      } catch (emailErr) {
        console.error("Failed to send admin decision email", emailErr);
      }
    }

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to process admin request",
    });
  }
});

export default router;
