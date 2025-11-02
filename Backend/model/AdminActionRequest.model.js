import mongoose from "mongoose";

const AdminActionRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetName: {
      type: String,
    },
    targetEmail: {
      type: String,
    },
    action: {
      type: String,
      enum: ["delete_user", "promote_admin", "demote_admin"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    message: {
      type: String,
      default: "",
    },
    responseMessage: {
      type: String,
      default: "",
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const AdminActionRequest = mongoose.model(
  "AdminActionRequest",
  AdminActionRequestSchema
);
