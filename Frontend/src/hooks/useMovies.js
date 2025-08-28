import { useEffect, useMemo, useState } from "react";
import { fetchMovies, fetchDramaMovies, fetchFictionMovies } from "@/api/tmdb";
import { getWindowPages } from "@/utils/windowPages";

export function useAllMovies(initialPage = 1) {
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
  }, [page]);

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
