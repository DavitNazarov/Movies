// Helper functions for rating calculations

import { User } from "../model/User.model.js";

const normalizeMovieId = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

export const calculateRatingSummary = async (movieId) => {
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
