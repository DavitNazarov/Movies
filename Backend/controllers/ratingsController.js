// Controller functions for ratings routes

import { User } from "../model/User.model.js";
import { calculateRatingSummary } from "../utils/ratingHelpers.js";

const normalizeMovieId = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

// POST /api/users/me/ratings - submit rating
export const submitRating = async (req, res) => {
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
};

// GET /api/users/movie-ratings/:movieId - get movie rating summary
export const getMovieRatings = async (req, res) => {
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
};
