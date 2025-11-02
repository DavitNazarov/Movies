import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
    default: "/avatars/default.jpg",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  lastLogIn: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,

  verificationToken: String,
  verificationTokenExpiresAt: Date,

  adminRequestStatus: {
    type: String,
    enum: ["none", "pending", "approved", "declined"],
    default: "none",
  },
  adminRequestMessage: {
    type: String,
    default: "",
  },
  adminRequestAt: {
    type: Date,
  },
  adminRequestResolvedAt: {
    type: Date,
  },
});

export const User = mongoose.model("User", UserSchema);
