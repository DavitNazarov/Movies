// Ad Request Model
// Users can request to display ads in banner sections
// Super admin can approve/decline requests
// Ads have start and end dates, and are automatically shown/hidden based on dates
import mongoose from "mongoose";

const AdRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      // Can be either external URL or path to uploaded file
    },
    linkUrl: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined", "deactivated"],
      default: "pending",
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

// Index for efficient queries of active ads
AdRequestSchema.index({ status: 1, startDate: 1, endDate: 1 });

export const AdRequest = mongoose.model("AdRequest", AdRequestSchema);

