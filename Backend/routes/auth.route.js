import express from "express";
import {
  EmailVerification,
  forgotPassword,
  getMe,
  login,
  logout,
  resetPassword,
  signUp,
} from "../controllers/auth.controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);

router.post("/verify-email", EmailVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
