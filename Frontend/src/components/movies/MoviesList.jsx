import MovieGrid from "@/components/movies/MovieGrid";
import Pagination from "@/components/movies/Pagination";

export default function MoviesList({
  movies,
  genre = "",
  page,
  setPage,
  totalPages,
  loading,
  err,
  windowPages,
}) {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Popular {genre} Films</h1>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Page {page} / {totalPages}
          </span>
        </header>

        {err && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/40">
            {err}
          </div>
        )}

        <MovieGrid movies={movies} loading={loading} page={page} />

        <Pagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          windowPages={windowPages}
        />
      </div>
    </div>
  );
}
