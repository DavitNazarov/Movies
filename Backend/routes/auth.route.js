import express from "express";
import {
  EmailVerification,
  login,
  logout,
  signUp,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", EmailVerification);

export default router;
