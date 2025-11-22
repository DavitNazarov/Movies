import express from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getRecentUsers,
  getAllUsers,
  getUserStats,
  updateProfile,
  deleteUser,
  changePassword,
} from "../controllers/userController.js";
import {
  requestAdminRole,
  processAdminRequest,
  updateUserStatus,
} from "../controllers/adminRequestUserController.js";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favoritesController.js";
import {
  submitRating,
  getMovieRatings,
} from "../controllers/ratingsController.js";

const router = express.Router();

// User management routes
router.get("/", verifyToken, isAdmin, getRecentUsers);
router.get("/stats", verifyToken, isAdmin, getUserStats);
router.get("/all", verifyToken, isAdmin, getAllUsers);
router.patch("/me", verifyToken, updateProfile);
router.patch("/me/password", verifyToken, changePassword);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

// Admin request routes
router.post("/me/admin-request", verifyToken, requestAdminRole);
router.post("/:id/admin-request", verifyToken, isAdmin, processAdminRequest);
router.patch("/:id/status", verifyToken, isAdmin, updateUserStatus);

// Favorites routes
router.get("/me/favorites", verifyToken, getFavorites);
router.post("/me/favorites", verifyToken, addFavorite);
router.delete("/me/favorites/:movieId", verifyToken, removeFavorite);

// Ratings routes
router.post("/me/ratings", verifyToken, submitRating);
router.get("/movie-ratings/:movieId", getMovieRatings);

export default router;
