// Controller functions for favorites routes

import { User } from "../model/User.model.js";

const normalizeMovieId = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

// GET /api/users/me/favorites - get user's favorites
export const getFavorites = async (req, res) => {
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
};

// POST /api/users/me/favorites - add favorite
export const addFavorite = async (req, res) => {
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
          : (title?.toString?.() ?? "");
    const safePoster =
      typeof posterPath === "string"
        ? posterPath
        : (posterPath?.toString?.() ?? "");
    const safeBackdrop =
      typeof backdropPath === "string"
        ? backdropPath
        : (backdropPath?.toString?.() ?? "");
    const safeRelease =
      typeof releaseDate === "string"
        ? releaseDate
        : (releaseDate?.toString?.() ?? "");

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
};

// DELETE /api/users/me/favorites/:movieId - remove favorite
export const removeFavorite = async (req, res) => {
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
};
