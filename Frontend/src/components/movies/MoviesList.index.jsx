// src/pages/MoviesList.jsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchMovies } from "@/api/tmdb";

const IMG = (path) => (path ? `https://image.tmdb.org/t/p/w500${path}` : "");

function PageButton({ active, children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "px-3 py-1.5 rounded-lg text-sm border transition-colors",
        active
          ? "bg-black text-white dark:bg-white dark:text-black border-transparent"
          : "bg-white text-black dark:bg-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
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
        setTotalPages(Math.min(data?.total_pages ?? 1, 500)); // TMDB caps at 500
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

  // compact window of page numbers
  const windowPages = useMemo(() => {
    const span = 5; // visible numbers
    const half = Math.floor(span / 2);
    const start = Math.max(1, page - half);
    const end = Math.min(totalPages, start + span - 1);
    const fixedStart = Math.max(1, end - span + 1);
    return Array.from(
      { length: end - fixedStart + 1 },
      (_, i) => fixedStart + i
    );
  }, [page, totalPages]);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Popular Films</h1>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Page {page} / {totalPages}
          </span>
        </header>

        {err ? (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/40">
            {err}
          </div>
        ) : null}

        {/* Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`page-${page}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              {movies.map((m) => (
                <motion.article
                  key={m.id}
                  layout
                  whileHover={{ y: -4 }}
                  className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="relative">
                    <img
                      src={IMG(m.poster_path) || IMG(m.backdrop_path)}
                      alt={m.title}
                      loading="lazy"
                      className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-3">
                    <h2 className="line-clamp-2 text-sm font-medium">
                      {m.title}
                    </h2>
                    <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                      <span>{m.release_date?.slice(0, 4) || "—"}</span>
                      <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
                        ★ {m.vote_average?.toFixed(1) ?? "—"}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        <nav className="mt-8 flex items-center justify-center gap-2">
          <PageButton
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </PageButton>

          {windowPages[0] > 1 && (
            <>
              <PageButton onClick={() => setPage(1)} active={page === 1}>
                1
              </PageButton>
              {windowPages[0] > 2 && (
                <span className="px-1 text-zinc-400">…</span>
              )}
            </>
          )}

          {windowPages.map((p) => (
            <PageButton key={p} onClick={() => setPage(p)} active={p === page}>
              {p}
            </PageButton>
          ))}

          {windowPages.at(-1) < totalPages && (
            <>
              {windowPages.at(-1) < totalPages - 1 && (
                <span className="px-1 text-zinc-400">…</span>
              )}
              <PageButton
                onClick={() => setPage(totalPages)}
                active={page === totalPages}
              >
                {totalPages}
              </PageButton>
            </>
          )}

          <PageButton
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </PageButton>
        </nav>
      </div>
    </div>
  );
}
