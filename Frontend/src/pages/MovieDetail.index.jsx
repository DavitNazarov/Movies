import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useMoviesById, useMoviesByGenre } from "@/hooks/useMovies";
import Loading from "@/components/ui/Loading";
import MovieBackdrop from "@/components/movies/MovieBackdrop";
import MovieContent from "@/components/movies/MovieContent";
import MovieTrailer from "@/components/movies/MovieTrailer";
import MoviesSimilar from "@/components/movies/MoviesSimilar";
import MovieActions from "@/components/movies/MovieActions";

const MovieDetail = () => {
  const { id } = useParams();
  const { movie, loading, err } = useMoviesById(id);

  // Fetch similar movies by first genre (fallback empty array)
  const genreId = movie?.genres?.[0]?.id;
  const { movies: similarMovies } = useMoviesByGenre(genreId, {
    enabled: !!genreId,
  });

  if (loading)
    return (
      <motion.div
        className="flex items-center justify-center min-h-[50vh] text-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Loading />
      </motion.div>
    );

  if (err || !movie)
    return (
      <motion.div
        className="flex items-center justify-center min-h-[50vh] text-red-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {" Movie not found. " + err?.match(/\d+/)?.[0]}
      </motion.div>
    );

  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Backdrop */}
      <MovieBackdrop backdrop_path={movie.backdrop_path} />

      {/* Content */}
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 -mt-28 sm:-mt-40 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <MovieContent
          poster_path={movie.poster_path}
          title={movie.title}
          tagline={movie.tagline}
          genres={movie.genres}
          release_date={movie.release_date}
          runtime={movie.runtime}
          vote_average={movie.vote_average}
          vote_count={movie.vote_count}
          overview={movie.overview}
          production_companies={movie.production_companies}
          production_countries={movie.production_countries}
          budget={movie.budget}
          revenue={movie.revenue}
          status={movie.status}
          popularity={movie.popularity}
        />

        <MovieActions movie={movie} />

        {/* Trailer */}
        <MovieTrailer trailer={trailer} />

        {/* Similar Movies */}
        <MoviesSimilar similarMovies={similarMovies} />
      </motion.div>
    </div>
  );
};

export default MovieDetail;
