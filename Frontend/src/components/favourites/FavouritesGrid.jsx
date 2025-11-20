import { Trash2 } from "lucide-react";
import { IMG } from "@/utils/img";
import { Button } from "@/components/ui/button";
import "@/components/movies/MovieRowRender.css";

export function FavouritesGrid({ favorites, onSelect, onRemove }) {
  return (
    <div className="space-y-6">
      <div
        className="movie-row__carousel"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(clamp(150px, 42vw, 240px), 1fr))",
          gap: "clamp(0.6rem, 2vw, 1.1rem)",
        }}
      >
        {favorites.map((movie) => {
          const imgSrc = movie.poster_path
            ? IMG(movie.poster_path)
            : movie.backdrop_path
              ? IMG(movie.backdrop_path)
              : null;

          return (
            <div
              key={movie.id}
              className="movie-card"
              style={{ position: "relative" }}
            >
              <div
                className="movie-card__image-wrapper"
                onClick={() => onSelect(movie.id)}
                style={{ cursor: "pointer" }}
              >
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={movie.title || "No poster"}
                    loading="lazy"
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, rgba(240, 249, 255, 0.65), rgba(226, 232, 240, 0.4))",
                      color: "#64748b",
                      fontSize: "0.875rem",
                    }}
                  >
                    No image
                  </div>
                )}
              </div>
              <div className="movie-card__body">
                <p className="movie-card__title">{movie.title || "Untitled"}</p>
                <div className="movie-card__meta">
                  <span className="movie-card__rating">
                    ★ {movie.vote_average?.toFixed(1) ?? "—"}
                  </span>
                  <span className="movie-card__year">
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "—"}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemove(movie.movieId)}
                  className="mt-2 w-full"
                  style={{ fontSize: "0.75rem", padding: "0.5rem" }}
                >
                  <Trash2 className="mr-2 size-3" />
                  Remove
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
