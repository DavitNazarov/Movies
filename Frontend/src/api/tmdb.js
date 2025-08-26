// src/api/tmdb.js
import axios from "axios";

const token = import.meta.env.VITE_TMDB_BEARER;
if (!token) throw new Error("Missing VITE_TMDB_BEARER");
export const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: { accept: "application/json" },
});

// ensure Authorization is present for ALL calls
api.defaults.headers.common.Authorization = `Bearer ${token}`;

export async function fetchMovies(page = 1) {
  const { data } = await api.get("/discover/movie", {
    params: {
      include_video: true,
      include_adult: false,
      language: "en-GB",
      sort_by: "popularity.desc",
      certification_lte: "PG-13",
      page, // 1..500
      with_origin_country: "US",
    },
  });
  return data; // { results, total_pages, ... }
}
