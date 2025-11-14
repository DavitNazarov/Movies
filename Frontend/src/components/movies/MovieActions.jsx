import { useCallback, useEffect, useMemo, useState } from "react";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { api, getErr } from "@/lib/api";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

const STARS = [1, 2, 3, 4, 5];

const MovieActions = ({ movie }) => {
  const movieId = movie?.id;
  const { user, setUser } = useAuth();
  const isAuthed = Boolean(user?._id || user?.id);
  const [isFavourite, setIsFavourite] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [favouriteLoading, setFavouriteLoading] = useState(false);

  const favouriteLabel = isFavourite ? "Saved to favourites" : "Add to favourites";
  const averageDisplay = useMemo(() => {
    if (ratingsCount === 0) return "No reviews yet";
    return `${Number(averageRating || 0).toFixed(1)} / 5`;
  }, [averageRating, ratingsCount]);

  useEffect(() => {
    if (!movieId) return;
    const currentFavourites = user?.favoriteMovies || [];
    setIsFavourite(currentFavourites.some((fav) => fav.movieId === movieId));

    const currentRating = (user?.ratings || []).find(
      (entry) => entry.movieId === movieId
    );
    setUserRating(currentRating?.rating || 0);
  }, [movieId, user?.favoriteMovies, user?.ratings]);

  useEffect(() => {
    if (!movieId) return;
    let active = true;
    (async () => {
      try {
        const { data } = await api.get(`/api/users/movie-ratings/${movieId}`);
        if (!active) return;
        const summary = data?.summary ?? {};
        setAverageRating(summary.average ?? 0);
        setRatingsCount(summary.count ?? 0);
      } catch {
        if (!active) return;
        setAverageRating(0);
        setRatingsCount(0);
      }
    })();

    return () => {
      active = false;
    };
  }, [movieId]);

  const handleToggleFavourite = useCallback(async () => {
    if (!movieId) return;
    if (!isAuthed) {
      toast.info("Please register to add favourite movies.");
      return;
    }

    setFavouriteLoading(true);
    try {
      if (isFavourite) {
        const { data } = await api.delete(
          `/api/users/me/favorites/${movieId}`
        );
        const favorites = data?.favorites ?? [];
        setIsFavourite(false);
        setUser((prev) =>
          prev
            ? {
                ...prev,
                favoriteMovies: favorites,
              }
            : prev
        );
        toast.success("Removed from favourites");
      } else {
        const { data } = await api.post("/api/users/me/favorites", {
          movieId,
          title: movie?.title,
          posterPath: movie?.poster_path,
          backdropPath: movie?.backdrop_path,
          releaseDate: movie?.release_date,
          voteAverage: movie?.vote_average,
        });
        const favorites = data?.favorites ?? [];
        setIsFavourite(true);
        setUser((prev) =>
          prev
            ? {
                ...prev,
                favoriteMovies: favorites,
              }
            : prev
        );
        toast.success("Added to favourites");
      }
    } catch (err) {
      toast.error(getErr(err));
    } finally {
      setFavouriteLoading(false);
    }
  }, [
    isAuthed,
    isFavourite,
    movie?.backdrop_path,
    movie?.poster_path,
    movie?.release_date,
    movie?.title,
    movie?.vote_average,
    movieId,
    setUser,
  ]);

  const handleRate = useCallback(
    async (value) => {
      if (!movieId) return;
      if (!isAuthed) {
        toast.info("Please register to rate movies.");
        return;
      }
      setRatingLoading(true);
      try {
        const { data } = await api.post("/api/users/me/ratings", {
          movieId,
          rating: value,
        });
        const summary = data?.summary ?? {};
        setUserRating(data?.rating ?? value);
        setAverageRating(summary.average ?? 0);
        setRatingsCount(summary.count ?? 0);
        setUser((prev) =>
          prev
            ? {
                ...prev,
                ratings: [
                  ...(prev.ratings || []).filter(
                    (entry) => entry.movieId !== movieId
                  ),
                  {
                    movieId,
                    rating: data?.rating ?? value,
                    updatedAt: new Date().toISOString(),
                  },
                ],
              }
            : prev
        );
        toast.success("Rating submitted");
      } catch (err) {
        toast.error(getErr(err));
      } finally {
        setRatingLoading(false);
      }
    },
    [isAuthed, movieId, setUser]
  );

  const activeStar = hoveredStar || userRating;

  return (
    <section className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <Button
            type="button"
            onClick={handleToggleFavourite}
            disabled={favouriteLoading}
            className={cn(
              "w-full justify-center bg-rose-500 text-white hover:bg-rose-600 md:w-auto",
              isFavourite && "bg-rose-600 hover:bg-rose-600"
            )}
          >
            <Heart
              className={cn(
                "size-4",
                isFavourite ? "fill-white text-white" : "text-white"
              )}
            />
            {favouriteLabel}
          </Button>
          <div className="flex flex-col text-sm text-zinc-600 md:text-left">
            <span className="font-semibold text-zinc-800">Reviews</span>
            <span>
              {averageDisplay}
              {ratingsCount > 0 && (
                <span className="ml-1 text-xs text-zinc-500">
                  ({ratingsCount} {ratingsCount === 1 ? "review" : "reviews"})
                </span>
              )}
            </span>
          </div>
        </div>
        {!isAuthed && (
          <p className="text-xs text-rose-600">
            Please register to add favourite movies.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-zinc-100 pt-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-1">
          {STARS.map((value) => (
            <button
              key={value}
              type="button"
              disabled={ratingLoading}
              onMouseEnter={() => setHoveredStar(value)}
              onMouseLeave={() => setHoveredStar(0)}
              onFocus={() => setHoveredStar(value)}
              onBlur={() => setHoveredStar(0)}
              onClick={() => handleRate(value)}
              className="transition-transform hover:scale-105 focus-visible:scale-105"
            >
              <Star
                className={cn(
                  "size-8 stroke-[1.5] text-amber-500",
                  value <= activeStar
                    ? "fill-amber-400"
                    : "fill-transparent text-amber-400"
                )}
              />
            </button>
          ))}
        </div>
        <div className="text-sm text-zinc-600">
          {userRating
            ? `You rated this movie ${userRating} / 5`
            : "Hover and click to rate this movie"}
        </div>
      </div>
    </section>
  );
};

export default MovieActions;

