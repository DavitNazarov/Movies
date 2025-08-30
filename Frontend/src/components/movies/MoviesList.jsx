import MovieGrid from "@/components/movies/MovieGrid";
import Pagination from "@/components/movies/Pagination";
import { path } from "@/constants/routes.const";
import { Link } from "react-router-dom";

export default function MoviesList({
  movies,
  search = false,
  genre = "",
  page,
  setPage,
  totalPages,
  loading,
  err,
  windowPages,
}) {
  const inSearchMode = typeof search === "string"; // search input   passes a string
  const hasQuery = inSearchMode && search.trim() !== "";

  const heading = inSearchMode
    ? hasQuery
      ? `Search Results for “${search}”`
      : "Search for a movie"
    : `Popular ${genre} Films`;
  return (
    <div className="min-h-screen bg-white text-black dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{heading}</h1>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Page {page} / {totalPages}
          </span>
        </header>

        {err && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/40">
            {err}
          </div>
        )}

        {!loading && !err && movies.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 p-8 text-center dark:border-zinc-800">
            <p className="text-lg font-medium">
              No results for{" "}
              <span className="underline">{search || "your query"}</span>.
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Check the spelling or try a different title.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                to={path.search}
                className="rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                Clear search
              </Link>
              <Link
                to={path.movies}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-zinc-900"
              >
                Go to popular movies
              </Link>
            </div>
          </div>
        ) : (
          <>
            <MovieGrid movies={movies} loading={loading} page={page} />
            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              windowPages={windowPages}
            />
          </>
        )}
      </div>
    </div>
  );
}
