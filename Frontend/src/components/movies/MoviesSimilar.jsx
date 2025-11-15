import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./MoviesSimilar.css";

const MoviesSimilar = ({ similarMovies }) => {
  const safeMovies = useMemo(
    () => (Array.isArray(similarMovies) ? similarMovies.filter(Boolean) : []),
    [similarMovies]
  );

  if (safeMovies.length === 0) return null;

  return (
    <motion.section
      className="similar-row"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="similar-row__container">
        <h2 className="similar-row__title">Similar Movies</h2>

        <div className="similar-row__carousel">
          {safeMovies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="similar-card"
            >
              <div className="similar-card__image-wrapper">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  loading="lazy"
                />
              </div>
              <div className="similar-card__body">
                <p className="similar-card__title">{movie.title}</p>
                {movie.release_date && (
                  <span className="similar-card__year">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default MoviesSimilar;
