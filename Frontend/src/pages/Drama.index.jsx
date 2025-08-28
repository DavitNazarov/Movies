import { useDramaMovies } from "@/hooks/useMovies";
import MoviesList from "../components/movies/MoviesList";

const Drama = () => {
  const { movies, page, setPage, totalPages, loading, err, windowPages } =
    useDramaMovies(1);

  return (
    <MoviesList
      movies={movies}
      page={page}
      setPage={setPage}
      totalPages={totalPages}
      loading={loading}
      err={err}
      windowPages={windowPages}
      genre="Drama"
    />
  );
};

export default Drama;
