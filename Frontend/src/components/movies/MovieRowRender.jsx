import { useMemo } from "react";
import { Link } from "react-router-dom";
import "./MovieRowRender.css";

const MovieRowRender = ({ title, movies }) => {
  const safeMovies = useMemo(
    () => (Array.isArray(movies) ? movies.filter(Boolean) : []),
    [movies]
  );

  return (
    <section className="movie-row">
      <div className="movie-row__container">
        <h2 className="movie-row__title">{title}</h2>

        <div className="movie-row__carousel">
          {safeMovies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="movie-card"
            >
              <div className="movie-card__image-wrapper">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  loading="lazy"
                />
              </div>
              <div className="movie-card__body">
                <p className="movie-card__title">{movie.title}</p>
                <div className="movie-card__meta">
                  <span className="movie-card__rating">
                    ★ {Number(movie.vote_average || 0).toFixed(1)}
                  </span>
                  {movie.release_date && (
                    <span className="movie-card__year">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieRowRender;
