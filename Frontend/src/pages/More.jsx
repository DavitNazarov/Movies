import { useSearchParams } from "react-router-dom";
import { useAllMovies, useSearchMovies } from "@/hooks/useMovies";
import MoviesList from "@/components/movies/MoviesList";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const hasQuery = q.length > 0;

  const allMoviesState = useAllMovies(1, { enabled: !hasQuery });
  const searchMoviesState = useSearchMovies(q, 1, { enabled: hasQuery });

  const { movies, page, setPage, totalPages, loading, err, windowPages } =
    hasQuery ? searchMoviesState : allMoviesState;

  return (
    <MoviesList
      movies={movies}
      search={q}
      page={page}
      setPage={setPage}
      totalPages={totalPages}
      loading={loading}
      err={err}
      windowPages={windowPages}
    />
  );
}
