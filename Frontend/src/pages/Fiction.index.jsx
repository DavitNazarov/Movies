import MoviesList from "@/components/movies/MoviesList";
import { useFictionMovies } from "@/hooks/useMovies";
import React from "react";

const Fiction = () => {
  const { movies, page, setPage, totalPages, loading, err, windowPages } =
    useFictionMovies();
  return (
    <MoviesList
      movies={movies}
      page={page}
      setPage={setPage}
      totalPages={totalPages}
      loading={loading}
      err={err}
      windowPages={windowPages}
      genre="Fiction"
    />
  );
};

export default Fiction;
