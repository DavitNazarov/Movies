import express from "express";
import { User } from "../model/User.model.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

const normalizeMovieId = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const calculateRatingSummary = async (movieId) => {
  const normalizedMovieId = normalizeMovieId(movieId);
  if (!normalizedMovieId) {
    return { average: 0, count: 0 };
  }

  const result = await User.aggregate([
    { $match: { "ratings.movieId": normalizedMovieId } },
    { $unwind: "$ratings" },
    { $match: { "ratings.movieId": normalizedMovieId } },
    {
      $group: {
        _id: "$ratings.movieId",
        average: { $avg: "$ratings.rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (!result.length) {
    return { average: 0, count: 0 };
  }

  return {
    average: Number(result[0].average?.toFixed?.(2) ?? result[0].average ?? 0),
    count: result[0].count ?? 0,
  };
};

// GET /api/users - admin only
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude password
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/users/me - update current user's profile
router.patch("/me", verifyToken, async (req, res) => {
  const { name } = req.body ?? {};
  const trimmedName = typeof name === "string" ? name.trim() : "";

  if (!trimmedName) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name: trimmedName },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const safeUser = await User.findById(updatedUser._id).select(
      "_id name email imageUrl isAdmin isSuperAdmin isVerified adminRequestStatus adminRequestMessage adminRequestAt adminRequestResolvedAt"
    );

    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
});

// POST /api/users/me/admin-request - request admin role
router.post("/me/admin-request", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "You already have admin access" });
    }

    if (user.adminRequestStatus === "pending") {
      return res.status(400).json({
        success: false,
        message: "Your previous request is still pending",
      });
    }

    user.adminRequestStatus = "pending";
    user.adminRequestAt = new Date();
    user.adminRequestMessage = "";
    user.adminRequestResolvedAt = undefined;

    await user.save();

    const safeUser = await User.findById(user._id).select(
      "_id name email imageUrl isAdmin isSuperAdmin isVerified adminRequestStatus adminRequestMessage adminRequestAt adminRequestResolvedAt"
    );

    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to submit request" });
  }
});

// DELETE /api/users/:id - admin can delete users
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  if (!req.user.isSuperAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Super admin only" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isSuperAdmin) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the super admin",
      });
    }

    await user.deleteOne();
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

// POST /api/users/:id/admin-request - admin approves or rejects admin request
router.post("/:id/admin-request", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { action, message = "" } = req.body ?? {};

  if (!req.user.isSuperAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Super admin only" });
  }

  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ success: false, message: "Invalid action" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isSuperAdmin) {
      return res.status(400).json({
        success: false,
        message: "Cannot change status of super admin",
      });
    }

    if (action === "approve") {
      user.isAdmin = true;
      user.adminRequestStatus = "approved";
    } else {
      user.adminRequestStatus = "declined";
    }

    user.adminRequestMessage = message;
    user.adminRequestResolvedAt = new Date();

    await user.save();

    const safeUser = await User.findById(user._id).select(
      "_id name email imageUrl isAdmin isSuperAdmin isVerified adminRequestStatus adminRequestMessage adminRequestAt adminRequestResolvedAt"
    );

    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to process request" });
  }
});

// Direct status update (super admin only)
router.patch("/:id/status", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { isAdmin: adminStatus, isVerified } = req.body ?? {};

  if (!req.user.isSuperAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Super admin only" });
  }

  const update = {};
  if (typeof adminStatus === "boolean") {
    update.isAdmin = adminStatus;
    update.adminRequestStatus = adminStatus ? "approved" : "none";
    if (!adminStatus) {
      update.adminRequestMessage = "";
      update.adminRequestResolvedAt = new Date();
    }
  }
  if (typeof isVerified === "boolean") {
    update.isVerified = isVerified;
  }

  if (Object.keys(update).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No valid status fields provided" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isSuperAdmin) {
      return res.status(400).json({
        success: false,
        message: "Cannot change status of the super admin",
      });
    }

    Object.assign(user, update);
    await user.save();

    const safeUser = await User.findById(user._id).select(
      "_id name email imageUrl isAdmin isSuperAdmin isVerified adminRequestStatus adminRequestMessage adminRequestAt adminRequestResolvedAt favoriteMovies ratings"
    );

    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update user status" });
  }
});

// ===== Favorites =====
router.get("/me/favorites", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("favoriteMovies");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      favorites: user.favoriteMovies ?? [],
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to load favourites" });
  }
});

router.post("/me/favorites", verifyToken, async (req, res) => {
  const {
    movieId,
    title = "",
    posterPath = "",
    backdropPath = "",
    releaseDate = "",
    voteAverage = null,
  } = req.body ?? {};

  const normalizedMovieId = normalizeMovieId(movieId);
  if (!normalizedMovieId) {
    return res
      .status(400)
      .json({ success: false, message: "Valid movieId is required" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const existingIndex = user.favoriteMovies.findIndex(
      (fav) => fav.movieId === normalizedMovieId
    );

    const safeTitle =
      typeof title === "string"
        ? title
        : typeof title === "number"
        ? String(title)
        : title?.toString?.() ?? "";
    const safePoster =
      typeof posterPath === "string" ? posterPath : posterPath?.toString?.() ?? "";
    const safeBackdrop =
      typeof backdropPath === "string"
        ? backdropPath
        : backdropPath?.toString?.() ?? "";
    const safeRelease =
      typeof releaseDate === "string"
        ? releaseDate
        : releaseDate?.toString?.() ?? "";

    const payload = {
      movieId: normalizedMovieId,
      title: safeTitle.trim().slice(0, 200),
      posterPath: safePoster.trim(),
      backdropPath: safeBackdrop.trim(),
      releaseDate: safeRelease.trim().slice(0, 30),
      voteAverage:
        typeof voteAverage === "number"
          ? Math.max(0, Math.min(10, voteAverage))
          : null,
      addedAt: new Date(),
    };

    if (existingIndex >= 0) {
      user.favoriteMovies[existingIndex] = {
        ...user.favoriteMovies[existingIndex],
        ...payload,
        addedAt: user.favoriteMovies[existingIndex].addedAt ?? new Date(),
      };
    } else {
      user.favoriteMovies.push(payload);
    }

    await user.save();

    // sync req.user for downstream middleware
    req.user.favoriteMovies = user.favoriteMovies;

    res.json({
      success: true,
      favorites: user.favoriteMovies,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update favourites" });
  }
});

router.delete("/me/favorites/:movieId", verifyToken, async (req, res) => {
  const normalizedMovieId = normalizeMovieId(req.params.movieId);

  if (!normalizedMovieId) {
    return res
      .status(400)
      .json({ success: false, message: "Valid movieId is required" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const initialLength = user.favoriteMovies.length;
    user.favoriteMovies = user.favoriteMovies.filter(
      (fav) => fav.movieId !== normalizedMovieId
    );

    if (user.favoriteMovies.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Movie not found in favourites",
      });
    }

    await user.save();
    req.user.favoriteMovies = user.favoriteMovies;

    res.json({
      success: true,
      favorites: user.favoriteMovies,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to remove favourite" });
  }
});

router.post("/me/ratings", verifyToken, async (req, res) => {
  const { movieId, rating } = req.body ?? {};

  const normalizedMovieId = normalizeMovieId(movieId);
  const numericRating = Number(rating);

  if (!normalizedMovieId) {
    return res
      .status(400)
      .json({ success: false, message: "Valid movieId is required" });
  }

  if (!Number.isFinite(numericRating)) {
    return res
      .status(400)
      .json({ success: false, message: "Valid rating is required" });
  }

  const boundedRating = Math.max(1, Math.min(5, numericRating));

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const existingIndex = user.ratings.findIndex(
      (entry) => entry.movieId === normalizedMovieId
    );

    if (existingIndex >= 0) {
      user.ratings[existingIndex].rating = boundedRating;
      user.ratings[existingIndex].updatedAt = new Date();
    } else {
      user.ratings.push({
        movieId: normalizedMovieId,
        rating: boundedRating,
        updatedAt: new Date(),
      });
    }

    await user.save();
    req.user.ratings = user.ratings;

    const summary = await calculateRatingSummary(normalizedMovieId);

    res.json({
      success: true,
      rating: boundedRating,
      summary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to submit rating",
    });
  }
});

router.get("/movie-ratings/:movieId", async (req, res) => {
  try {
    const summary = await calculateRatingSummary(req.params.movieId);
    res.json({ success: true, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load ratings",
    });
  }
});

export default router;
