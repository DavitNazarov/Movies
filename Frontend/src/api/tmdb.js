import axios from "axios";

const token = import.meta.env.VITE_TMDB_BEARER;
if (!token) throw new Error("Missing VITE_TMDB_BEARER");
export const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: { accept: "application/json", Authorization: `Bearer ${token}` },
});

export async function fetchMovies(page = 1) {
  const { data } = await api.get("/discover/movie", {
    params: {
      include_video: true,
      include_adult: false,
      language: "en-GB",
      certification_lte: "PG-13",
      page, // 1..500
      with_origin_country: "US",
      sort_by: "popularity.desc",
    },
  });
  return data; // { results, total_pages, ... }
}

export async function fetchDramaMovies(page = 1) {
  const { data } = await api.get("/discover/movie", {
    params: {
      include_video: true,
      include_adult: false,
      language: "en-GB",
      sort_by: "popularity.desc",
      certification_lte: "PG-13",
      page, // 1..500
      with_origin_country: "US",
      with_genres: "18", // Drama genre ID
      sort_by: "popularity.desc",
    },
  });
  return data; // { results, total_pages, ... }
}
export async function fetchFictionMovies(page = 1) {
  const { data } = await api.get("/discover/movie", {
    params: {
      include_video: true,
      include_adult: false,
      language: "en-GB",
      sort_by: "popularity.desc",
      certification_lte: "PG-13",
      page, // 1..500
      with_origin_country: "US",
      with_genres: "878", // fiction genre ID
      sort_by: "popularity.desc",
    },
  });
  return data; // { results, total_pages, ... }
}

export async function fetchSearchMovies(query, page = 1) {
  const { data } = await api.get("/search/movie", {
    params: {
      include_video: true,
      include_adult: true,
      language: "en-GB",
      page, // 1..500
      query,
      with_origin_country: "US",
    },
  });
  console.log(data);

  return data; // { results, total_pages, ... }
}
