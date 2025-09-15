import { useMoviesById } from "@/hooks/useMovies";
import React from "react";
import { useParams } from "react-router-dom";

const MovieDetail = () => {
  const { id } = useParams();
  const { movie, loading, err } = useMoviesById(id);
  console.log(movie);

  if (loading) return <p>Loading...</p>;
  if (err) return <p className="text-red-500">{err}</p>;
  if (!movie) return <p>No movie found</p>;
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      <p className="mt-2 text-zinc-600">{movie.overview}</p>
      <p className="mt-4">Release Date: {movie.release_date}</p>
      <p>Rating: {movie.vote_average}</p>
    </div>
  );
};

export default MovieDetail;
