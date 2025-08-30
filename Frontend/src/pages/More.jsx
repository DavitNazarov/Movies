// More.jsx (the /search page)
import { useSearchParams } from "react-router-dom";
import { useAllMovies, useSearchMovies } from "@/hooks/useMovies";
import MoviesList from "@/components/movies/MoviesList";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();

  const state = q ? useSearchMovies(q, 1) : useAllMovies(1);
  const { movies, page, setPage, totalPages, loading, err, windowPages } =
    state;

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
