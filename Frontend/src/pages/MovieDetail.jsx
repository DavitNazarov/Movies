import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMoviesById, useMoviesByGenre } from "@/hooks/useMovies";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
        className="flex items-center justify-center h-96 text-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading...
      </motion.div>
    );

  if (err || !movie)
    return (
      <motion.div
        className="flex items-center justify-center h-96 text-red-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {err || "Movie not found"}
      </motion.div>
    );

  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Parallax Backdrop */}
      <div
        className="relative w-full h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        className="max-w-6xl mx-auto px-6 -mt-40 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid md:grid-cols-3 gap-10">
          {/* Poster */}
          <motion.img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-2xl shadow-lg w-full"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          />

          {/* Info */}
          <motion.div
            className="md:col-span-2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="italic text-gray-600 mb-4">“{movie.tagline}”</p>
            )}

            <div className="flex flex-wrap gap-3 mb-4">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 bg-black text-white rounded-full text-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-gray-700 mb-2">
              🗓 {movie.release_date || "Unknown"} | ⏱ {movie.runtime} min
            </p>
            <p className="text-gray-700 mb-2">
              ⭐ {movie.vote_average?.toFixed(1)} / 10 ({movie.vote_count}{" "}
              votes)
            </p>
            <p className="text-gray-700 mb-6">{movie.overview}</p>

            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold text-black mb-1">
                  Production Companies
                </h3>
                <ul>
                  {movie.production_companies?.map((c) => (
                    <li key={c.id}>{c.name}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-black mb-1">
                  Production Countries
                </h3>
                <ul>
                  {movie.production_countries?.map((c) => (
                    <li key={c.iso_3166_1}>{c.name}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-black mb-1">Budget</h3>
                <p>
                  {movie.budget && movie.budget > 0
                    ? `$${movie.budget.toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-black mb-1">Revenue</h3>
                <p>
                  {movie.revenue && movie.revenue > 0
                    ? `$${movie.revenue.toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-black mb-1">Status</h3>
                <p>{movie.status}</p>
              </div>
              <div>
                <h3 className="font-semibold text-black mb-1">Popularity</h3>
                <p>{Math.round(movie.popularity)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trailer */}
        {trailer && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4">Trailer</h2>
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </motion.div>
        )}

        {/* Similar Movies */}
        {similarMovies?.length > 0 && (
          <motion.div
            className="mt-14"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold mb-4">Similar Movies</h2>
            <ScrollArea className="w-full whitespace-nowrap rounded-2xl border">
              <div className="flex space-x-6 p-4">
                {similarMovies.map((m) => (
                  <Link
                    to={`/movies/${m.id}`}
                    key={m.id}
                    className="w-[160px] shrink-0"
                  >
                    <motion.img
                      src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                      alt={m.title}
                      className="w-full h-64 object-cover rounded-xl shadow-md mb-2"
                      whileHover={{ scale: 1.05 }}
                    />
                    <p className="text-sm font-medium line-clamp-2">
                      {m.title}
                    </p>
                  </Link>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MovieDetail;
