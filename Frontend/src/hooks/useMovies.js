import { useEffect, useMemo, useState } from "react";
import {
  fetchMovies,
  fetchDramaMovies,
  fetchFictionMovies,
  fetchSearchMovies,
  fetchMoviesById,
  fetchMoviesByGenre,
} from "@/api/tmdb";
import { getWindowPages } from "@/utils/windowPages";

export function useAllMovies(initialPage = 1, { enabled = true } = {}) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!enabled) return; // keep deps stable, gate inside
    window.scrollTo({ top: 0, behavior: "smooth" });
    let canceled = false;
    setLoading(true);
    setErr("");
    fetchMovies(page)
      .then((data) => {
        if (canceled) return;
        setMovies(data?.results ?? []);
        setTotalPages(Math.min(data?.total_pages ?? 1, 500));
      })
      .catch((e) => {
        if (canceled) return;
        setErr(e?.message || "Failed to load");
        setMovies([]);
        setTotalPages(1);
      })
      .finally(() => !canceled && setLoading(false));
    return () => {
      canceled = true;
    };
  }, [page, enabled]); // fixed-length deps

  const windowPages = useMemo(
    () => getWindowPages(page, totalPages, 5),
    [page, totalPages]
  );

  return { movies, page, setPage, totalPages, loading, err, windowPages };
}

export function useDramaMovies(initialPage = 1) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    let canceled = false;
    setLoading(true);
    setErr("");
    fetchDramaMovies(page)
      .then((data) => {
        if (canceled) return;
        setMovies(data?.results ?? []);
        setTotalPages(Math.min(data?.total_pages ?? 1, 500));
      })
      .catch((e) => {
        if (canceled) return;
        setErr(e?.message || "Failed to load");
        setMovies([]);
        setTotalPages(1);
      })
      .finally(() => !canceled && setLoading(false));
    return () => {
      canceled = true;
    };
  }, [page]);

  const windowPages = useMemo(
    () => getWindowPages(page, totalPages, 5),
    [page, totalPages]
  );
  return { movies, page, setPage, totalPages, loading, err, windowPages };
}

export function useFictionMovies(initialPage = 1) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    let canceled = false;
    setLoading(true);
    setErr("");
    fetchFictionMovies(page)
      .then((data) => {
        if (canceled) return;
        setMovies(data?.results ?? []);
        setTotalPages(Math.min(data?.total_pages ?? 1, 500));
      })
      .catch((e) => {
        if (canceled) return;
        setErr(e?.message || "Failed to load");
        setMovies([]);
        setTotalPages(1);
      })
      .finally(() => !canceled && setLoading(false));
    return () => {
      canceled = true;
    };
  }, [page]);

  const windowPages = useMemo(
    () => getWindowPages(page, totalPages, 5),
    [page, totalPages]
  );
  return { movies, page, setPage, totalPages, loading, err, windowPages };
}

export function useSearchMovies(query, initialPage = 1) {
  const q = String(query ?? "").trim(); // normalise
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    setPage(initialPage);
  }, [q, initialPage]);

  useEffect(() => {
    if (!q) {
      setMovies([]);
      setTotalPages(1);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    let canceled = false;
    setLoading(true);
    setErr("");
    fetchSearchMovies(q, page)
      .then((data) => {
        if (canceled) return;
        setMovies(data?.results ?? []);
        setTotalPages(Math.min(data?.total_pages ?? 1, 500));
      })
      .catch((e) => {
        if (canceled) return;
        setErr(e?.message || "Failed to load");
        setMovies([]);
        setTotalPages(1);
      })
      .finally(() => !canceled && setLoading(false));
    return () => {
      canceled = true;
    };
  }, [q, page]); // fixed-length deps

  const windowPages = useMemo(
    () => getWindowPages(page, totalPages, 5),
    [page, totalPages]
  );

  return { movies, page, setPage, totalPages, loading, err, windowPages };
}

export function useMoviesById(id) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    let canceled = false;
    setLoading(true);
    setErr("");
    fetchMoviesById(id)
      .then((data) => {
        if (canceled) return;
        setMovie(data); // full object from TMDB
      })
      .catch((e) => {
        if (canceled) return;
        setErr(e?.message || "Failed to load");
        setMovie(null);
      })
      .finally(() => !canceled && setLoading(false));
    return () => {
      canceled = true;
    };
  }, [id]);

  return { movie, loading, err };
}
export function useMoviesByGenre(
  genreId,
  initialPage = 1,
  { enabled = true } = {}
) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!enabled || !genreId) return;

    window.scrollTo({ top: 0, behavior: "smooth" });
    let canceled = false;

    setLoading(true);
    setErr("");

    fetchMoviesByGenre(genreId, page)
      .then((data) => {
        if (canceled) return;
        setMovies(data?.results ?? []);
        setTotalPages(Math.min(data?.total_pages ?? 1, 500));
      })
      .catch((e) => {
        if (canceled) return;
        setErr(e?.message || "Failed to load");
        setMovies([]);
        setTotalPages(1);
      })
      .finally(() => !canceled && setLoading(false));

    return () => {
      canceled = true;
    };
  }, [genreId, page, enabled]);

  const windowPages = useMemo(
    () => getWindowPages(page, totalPages, 5),
    [page, totalPages]
  );

  return { movies, page, setPage, totalPages, loading, err, windowPages };
}
